import { NextRequest, NextResponse } from "next/server";
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
    const body = await request.json();
    const validation = analyzeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { resumeId, jdId, jdText } = validation.data;

    // 1. Load resume
    const resume = await getResumeById(resumeId);
    if (!resume || !resume.extractedText) {
      return NextResponse.json(
        { error: "Resume not found or text extraction failed" },
        { status: 404 },
      );
    }

    // 2. Load or use JD text
    let finalJdText = jdText || "";

    if (jdId) {
      const jd = await getJobDescriptionById(jdId);
      if (!jd || !jd.text) {
        return NextResponse.json(
          { error: "Job description not found" },
          { status: 404 },
        );
      }
      finalJdText = jd.text;
    }

    if (!finalJdText || finalJdText.length < 50) {
      return NextResponse.json(
        { error: "Job description text is missing or too short" },
        { status: 400 },
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
      temperature: 0.3,
      max_tokens: 2048,
      response_format: { type: "json_object" },
    });

    const rawResponse = completion.choices[0]?.message?.content || "{}";
    // ---------- Clean the response ----------
    function cleanJsonResponse(text: string): string {
      let cleaned = text.trim();

      // Remove markdown code fences if present
      if (cleaned.startsWith("```")) {
        cleaned = cleaned
          .replace(/^```(?:json)?\s*/i, "")
          .replace(/\s*```$/, "");
      }

      return cleaned.trim();
    }

    let analysis;
    try {
      //   analysis = JSON.parse(rawResponse);
      const cleaned = cleanJsonResponse(rawResponse);
      analysis = JSON.parse(cleaned);
    } catch (err) {
      console.error("Failed to parse model response:", rawResponse);
      return NextResponse.json(
        {
          error: "Model returned invalid JSON",
          raw: rawResponse,
        },
        { status: 502 },
      );
    }

    // Save the analysis to disk
    const saved = await saveAnalysis({
      resumeId,
      jdId: jdId || null,
      resume: resume.originalName,
      analysis,
      model: DMR_MODEL,
    });

    return NextResponse.json(
      {
        success: true,
        analysisId: saved.id,
        resumeId,
        jdId: jdId || null,
        analysis: saved.analysis,
        model: saved.model,
        createdAt: saved.createdAt,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Analyze error:", error);
    if (
      error.code === "ECONNREFUSED" ||
      error.message?.includes("fetch failed")
    ) {
      return NextResponse.json(
        {
          error:
            "Cannot connect to Docker Model Runner. Make sure it is running on the configured port.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const data = await getAllAnalysis();

    if (!data) {
      return NextResponse.json({
        success: true,
        analyses: [],
      });
    }

    const analyses = data.map((item: any) => ({
      id: item.id,
      resumeId: item.resumeId,
      fileName: item.resume,
      jdId: item.jdId,
      fitScore: item.analysis?.fitScore ?? null,
      summary: item.analysis?.summary ?? "",
      model: item.model,
      createdAt: item.createdAt,
    }));

    analyses.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return NextResponse.json({
      success: true,
      count: analyses.length,
      analyses,
    });
  } catch (error) {
    console.error("Failed to list analyses:", error);
    return NextResponse.json(
      { error: "Failed to load analyses" },
      { status: 500 },
    );
  }
}
