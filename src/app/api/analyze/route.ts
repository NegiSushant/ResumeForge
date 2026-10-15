import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { analyzeSchema } from "@/lib/schemas";
import { dmr, DMR_MODEL } from "@/lib/client";
import { createAnalysisPrompt } from "@/lib/prompts";
import {
  getResumeById,
  getJobDescriptionById,
  saveAnalysis,
  getAllAnalysis,
} from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to analyze resumes." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = analyzeSchema.safeParse(body);

    if (!validation.success) {
      console.log(validation.error.flatten().fieldErrors);
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { resumeId, jdId, jdText } = validation.data;

    // 1. Load resume and ensure it belongs to current user
    const resume = await getResumeById(resumeId, session.user.id);
    if (!resume || !resume.extractedText) {
      return NextResponse.json(
        { error: "Resume not found or access denied" },
        { status: 404 }
      );
    }

    // 2. Load or use JD text
    let finalJdText = jdText || "";

    if (jdId) {
      const jd = await getJobDescriptionById(jdId, session.user.id);
      if (!jd || !jd.text) {
        return NextResponse.json(
          { error: "Job description not found or access denied" },
          { status: 404 }
        );
      }
      finalJdText = jd.text;
    }

    if (!finalJdText || finalJdText.length < 50) {
      return NextResponse.json(
        { error: "Job description text is missing or too short (min 50 chars)" },
        { status: 400 }
      );
    }

    // 3. Call Docker Model Runner
    const prompt = createAnalysisPrompt(resume.extractedText, finalJdText);

    const completion = await dmr.chat.completions.create({
      model: DMR_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a precise resume analysis engine. Always respond with valid JSON only. Do not wrap the JSON in markdown code blocks.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1,
      max_tokens: 2048,
      response_format: { type: "json_object" },
    });

    const rawResponse = completion.choices[0]?.message?.content || "{}";

    function cleanAndSanitizeJson(text: string): string {
      let str = text.trim();
      if (str.startsWith("```")) {
        str = str.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
      }
      str = str.trim();

      const firstBrace = str.indexOf("{");
      const lastBrace = str.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        str = str.substring(firstBrace, lastBrace + 1);
      }

      let inString = false;
      let escaped = false;
      let out = "";

      for (let i = 0; i < str.length; i++) {
        const char = str[i];
        const code = str.charCodeAt(i);

        if (escaped) {
          out += char;
          escaped = false;
          continue;
        }

        if (char === "\\") {
          escaped = true;
          out += char;
          continue;
        }

        if (char === '"') {
          inString = !inString;
          out += char;
          continue;
        }

        if (inString) {
          if (char === "\n") {
            out += "\\n";
          } else if (char === "\r") {
            out += "\\r";
          } else if (char === "\t") {
            out += "\\t";
          } else if (code < 32) {
            // strip unprintable control characters
          } else {
            out += char;
          }
        } else {
          out += char;
        }
      }

      return out;
    }

    function parseJsonWithFallback(raw: string): any {
      const sanitized = cleanAndSanitizeJson(raw);
      try {
        return JSON.parse(sanitized);
      } catch (firstErr) {
        console.warn("Direct JSON.parse failed, recovering via regex extraction:", firstErr);

        const fitScoreMatch = sanitized.match(/"fitScore"\s*:\s*(\d+)/i);
        const fitScore = fitScoreMatch ? parseInt(fitScoreMatch[1], 10) : 50;

        const scoreExpMatch = sanitized.match(/"scoreExplanation"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/i);
        const scoreExplanation = scoreExpMatch ? scoreExpMatch[1].replace(/\\n/g, " ") : "";

        const summaryMatch = sanitized.match(/"summary"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/i);
        let summary = summaryMatch ? summaryMatch[1].replace(/\\n/g, " ") : "";
        if (summary.length > 350) {
          summary = summary.slice(0, 350).replace(/[^.!?]*$/, "");
        }

        const extractArray = (key: string): string[] => {
          const regex = new RegExp(`"${key}"\\s*:\\s*\\[([^\\]]*)\\]`, "i");
          const match = sanitized.match(regex);
          if (!match) return [];
          const items = match[1].match(/"([^"\\]*(?:\\.[^"\\]*)*)"/g);
          return items
            ? items.map((i) => i.replace(/^"|"$/g, "").replace(/\\n/g, " ").trim()).filter(Boolean)
            : [];
        };

        return {
          fitScore,
          scoreExplanation,
          summary,
          matchingSkills: extractArray("matchingSkills"),
          missingSkills: extractArray("missingSkills"),
          strengths: extractArray("strengths"),
          weaknesses: extractArray("weaknesses"),
          keywordGaps: extractArray("keywordGaps"),
          suggestedImprovements: [],
        };
      }
    }

    function normalizeAnalysis(raw: any) {
      const matchingSkills = Array.isArray(raw?.matchingSkills)
        ? raw.matchingSkills.map((s: any) =>
            typeof s === "string" ? s.trim() : String(s?.skill || s).trim()
          ).filter(Boolean)
        : [];

      const missingSkills = Array.isArray(raw?.missingSkills)
        ? raw.missingSkills.map((s: any) =>
            typeof s === "string" ? s.trim() : String(s?.skill || s).trim()
          ).filter(Boolean)
        : [];

      const strengths = Array.isArray(raw?.strengths)
        ? raw.strengths.map((s: any) =>
            typeof s === "string" ? s.trim() : String(s?.point || s).trim()
          ).filter(Boolean)
        : [];

      const weaknesses = Array.isArray(raw?.weaknesses)
        ? raw.weaknesses.map((s: any) =>
            typeof s === "string" ? s.trim() : String(s?.point || s).trim()
          ).filter(Boolean)
        : [];

      const keywordGaps = Array.isArray(raw?.keywordGaps)
        ? raw.keywordGaps.map((s: any) =>
            typeof s === "string" ? s.trim() : String(s?.keyword || s).trim()
          ).filter(Boolean)
        : [];

      let suggestedImprovements: { section: string; suggestion: string }[] = [];
      if (Array.isArray(raw?.suggestedImprovements)) {
        suggestedImprovements = raw.suggestedImprovements
          .map((item: any) => {
            if (typeof item === "string") {
              return {
                section: "Experience",
                suggestion: item.trim(),
              };
            }
            if (typeof item === "object" && item !== null) {
              const sec = String(
                item.section || item.area || item.title || "Experience"
              ).trim();
              return {
                section: sec === "Suggested Improvement" ? "Experience" : sec,
                suggestion: String(
                  item.suggestion ||
                    item.advice ||
                    item.point ||
                    item.description ||
                    JSON.stringify(item)
                ).trim(),
              };
            }
            return {
              section: "Experience",
              suggestion: String(item).trim(),
            };
          })
          .filter((item) => item.suggestion);
      }

      let fitScore = 0;
      if (typeof raw?.fitScore === "number") {
        fitScore = Math.min(100, Math.max(0, Math.round(raw.fitScore)));
      } else if (raw?.fitScore) {
        const parsed = parseInt(String(raw.fitScore), 10);
        fitScore = isNaN(parsed) ? 0 : Math.min(100, Math.max(0, parsed));
      }

      const scoreExplanation =
        typeof raw?.scoreExplanation === "string"
          ? raw.scoreExplanation.trim()
          : raw?.scoreExplanation
            ? String(raw.scoreExplanation)
            : "";

      let summary =
        typeof raw?.summary === "string"
          ? raw.summary.trim()
          : raw?.summary
            ? String(raw.summary).trim()
            : "";

      // Clean summary if model echoed the resume text
      if (summary.startsWith("Professional Summary:")) {
        summary = summary.replace(/^Professional Summary:\s*/i, "");
      }
      if (summary.length > 350) {
        const sentenceMatch = summary.match(/^(.*?[.!?](?:\s+.*?[.!?])?)/);
        summary = sentenceMatch ? sentenceMatch[1] : summary.slice(0, 300) + "...";
      }

      return {
        fitScore,
        scoreExplanation,
        summary,
        matchingSkills,
        missingSkills,
        strengths,
        weaknesses,
        suggestedImprovements,
        keywordGaps,
      };
    }

    let analysis;
    try {
      const parsedJson = parseJsonWithFallback(rawResponse);
      analysis = normalizeAnalysis(parsedJson);
    } catch (err) {
      console.error("JSON parse and fallback failed, raw response:", rawResponse, err);
      return NextResponse.json(
        {
          error: "Model returned invalid JSON",
          raw: rawResponse,
        },
        { status: 502 }
      );
    }

    // 4. Save analysis to MongoDB under current user
    const record = await saveAnalysis({
      userId: session.user.id,
      resumeId,
      resume: resume.originalName,
      jdId: jdId || null,
      jobDescription: finalJdText,
      resumeText: resume.extractedText,
      analysis,
      model: DMR_MODEL,
    });

    return NextResponse.json({
      success: true,
      analysisId: record.id,
      analysis,
      resumeId,
      resumeUrl: `/api/resumes/${resumeId}/file`,
      resumeMimeType: resume.mimeType,
      resumeText: resume.extractedText,
      jobDescription: finalJdText,
      model: DMR_MODEL,
      createdAt: record.createdAt,
    });
  } catch (error: any) {
    console.error("Analysis error:", error);

    if (error.code === "ECONNREFUSED") {
      return NextResponse.json(
        {
          error:
            "Docker Model Runner is not running. Please start it on port 12434.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: error?.message || "Failed to analyze resume" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const analyses = await getAllAnalysis(session.user.id);

    return NextResponse.json({
      success: true,
      analyses,
    });
  } catch (error) {
    console.error("Failed to fetch analyses:", error);
    return NextResponse.json(
      { error: "Failed to fetch analyses" },
      { status: 500 }
    );
  }
}
