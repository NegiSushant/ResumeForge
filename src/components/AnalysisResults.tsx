"use client";

import { useState } from "react";
import ScoreBadge from "@/components/ScoreBadge";

export interface AnalysisResult {
  fitScore: number;
  scoreExplanation?: string;
  summary: string;
  matchingSkills: string[];
  missingSkills: string[];
  strengths: string[];
  weaknesses: string[];
  suggestedImprovements: { section: string; suggestion: string }[];
  keywordGaps: string[];
}

export interface AnalysisResultsProps {
  analysis: AnalysisResult;
  resumeText?: string;
  resumeUrl?: string;
  jobDescription?: string;
  onReset: () => void;
}

export default function AnalysisResults({
  analysis,
  resumeText,
  resumeUrl,
  jobDescription,
  onReset,
}: AnalysisResultsProps) {
  const [activeSourceTab, setActiveSourceTab] = useState<
    "pdf" | "resumeText" | "jd"
  >(resumeUrl ? "pdf" : "resumeText");
  const [showSource, setShowSource] = useState(true);
  const [pdfHeight, setPdfHeight] = useState<"standard" | "tall">("standard");
  const [copied, setCopied] = useState(false);

  const hasSource = Boolean(resumeUrl || resumeText || jobDescription);

  function copyCurrentText() {
    const textToCopy =
      activeSourceTab === "resumeText"
        ? resumeText || ""
        : activeSourceTab === "jd"
          ? jobDescription || ""
          : resumeText || "";
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Analysis Result
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Powered by Gemma 3 (100% Local Inference)
            </p>
          </div>
          <button
            onClick={onReset}
            className="text-sm font-medium text-orange-600 hover:text-orange-700 underline cursor-pointer"
          >
            New Analysis
          </button>
        </div>

        <div className="flex items-end gap-4 mb-6">
          <div className="text-5xl font-bold text-gray-900 tracking-tight">
            {analysis.fitScore}
            <span className="text-2xl text-gray-400 font-normal">/100</span>
          </div>
          <ScoreBadge score={analysis.fitScore} />
        </div>

        {/* Score Explanation Rationale */}
        {analysis.scoreExplanation && (
          <div className="mb-6 p-4 rounded-xl bg-orange-50/70 border border-orange-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-800 block mb-1">
              Score Rationale
            </span>
            <p className="text-sm text-gray-800 leading-relaxed font-medium">
              {analysis.scoreExplanation}
            </p>
          </div>
        )}

        <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
      </div>

      {/* Skills Match vs Miss */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-emerald-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Matching Skills
            </h3>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {analysis.matchingSkills?.length || 0} found
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.matchingSkills?.length ? (
              analysis.matchingSkills.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs sm:text-sm font-medium rounded-full border border-emerald-100"
                >
                  ✓ {skill}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-sm">None detected</span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-orange-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              Missing Skills
            </h3>
            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
              {analysis.missingSkills?.length || 0} gaps
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.missingSkills?.length ? (
              analysis.missingSkills.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="px-3 py-1 bg-orange-50 text-orange-700 text-xs sm:text-sm font-medium rounded-full border border-orange-100"
                >
                  ✕ {skill}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-sm">None missing</span>
            )}
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-emerald-500 font-bold">▲</span> Key Strengths
          </h3>
          <ul className="space-y-2.5">
            {analysis.strengths?.map((item, i) => (
              <li key={i} className="text-sm text-gray-700 flex gap-2">
                <span className="text-emerald-500 shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-orange-500 font-bold">▼</span> Areas of
            Concern
          </h3>
          <ul className="space-y-2.5">
            {analysis.weaknesses?.map((item, i) => (
              <li key={i} className="text-sm text-gray-700 flex gap-2">
                <span className="text-orange-500 shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suggested Improvements with Real Section Names */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">
              Targeted Improvements
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Specific sections to modify for higher ATS screening conversion
            </p>
          </div>
        </div>
        <div className="space-y-4">
          {analysis.suggestedImprovements?.map((item: any, i: number) => {
            const isString = typeof item === "string";
            const section = isString ? "General" : item?.section || "General";
            const suggestion = isString ? item : item?.suggestion || "";

            return (
              <div key={i} className="border-l-4 border-orange-500 pl-4 py-1">
                <span className="inline-block px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800 rounded-md mb-1.5">
                  Section: {section}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {suggestion}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Keyword Gaps */}
      {analysis.keywordGaps?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">
              High-Priority ATS Keywords
            </h3>
            <span className="text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full font-medium">
              {analysis.keywordGaps.length} keywords
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.keywordGaps.map((kw) => (
              <span
                key={kw}
                className="px-3 py-1 bg-purple-50 text-purple-700 text-xs sm:text-sm font-medium rounded-full border border-purple-100"
              >
                + {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Original Source Documents (Resume PDF & Job Description) */}
      {hasSource && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-semibold text-gray-900">
                Analyzed Documents
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Inspect the original PDF or verify the exact text parsed by the
                local AI
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSource(!showSource)}
                className="text-xs text-gray-500 hover:text-gray-800 px-2.5 py-1 rounded-lg border border-gray-200 transition cursor-pointer"
              >
                {showSource ? "Collapse" : "Expand"}
              </button>
              {showSource && activeSourceTab !== "pdf" && (
                <button
                  onClick={copyCurrentText}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-lg transition cursor-pointer"
                >
                  {copied ? "✓ Copied" : "Copy Text"}
                </button>
              )}
            </div>
          </div>

          {showSource && (
            <div>
              {/* Tab Switcher */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex flex-wrap gap-2">
                  {resumeUrl && (
                    <button
                      onClick={() => setActiveSourceTab("pdf")}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                        activeSourceTab === "pdf"
                          ? "bg-[#1a1a1a] text-white shadow-xs"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <span className="text-orange-400 font-bold">📄</span>
                      Original Resume (PDF)
                    </button>
                  )}
                  {resumeText && (
                    <button
                      onClick={() => setActiveSourceTab("resumeText")}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer ${
                        activeSourceTab === "resumeText"
                          ? "bg-[#1a1a1a] text-white shadow-xs"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Extracted Text ({resumeText.length.toLocaleString()}{" "}
                      chars)
                    </button>
                  )}
                  {jobDescription && (
                    <button
                      onClick={() => setActiveSourceTab("jd")}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer ${
                        activeSourceTab === "jd"
                          ? "bg-[#1a1a1a] text-white shadow-xs"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Job Description ({jobDescription.length.toLocaleString()}{" "}
                      chars)
                    </button>
                  )}
                </div>

                {activeSourceTab === "pdf" && resumeUrl && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setPdfHeight(
                          pdfHeight === "standard" ? "tall" : "standard",
                        )
                      }
                      className="text-xs text-gray-600 hover:text-gray-900 px-2 py-1 rounded bg-gray-50 border border-gray-200 cursor-pointer"
                    >
                      {pdfHeight === "standard"
                        ? "⤢ Expand Height"
                        : "⤡ Standard Height"}
                    </button>
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-orange-600 hover:text-orange-700 px-2 py-1 rounded bg-orange-50 border border-orange-200 font-medium cursor-pointer"
                    >
                      Open in New Tab ↗
                    </a>
                  </div>
                )}
              </div>

              {/* PDF Viewer Tab */}
              {activeSourceTab === "pdf" && resumeUrl && (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                  <object
                    data={`${resumeUrl}#toolbar=1&navpanes=0`}
                    type="application/pdf"
                    className={`w-full ${
                      pdfHeight === "tall" ? "h-212.5" : "h-155"
                    } rounded-xl bg-white`}
                  >
                    {/* Fallback iframe */}
                    <iframe
                      src={`${resumeUrl}#toolbar=1`}
                      className="w-full h-full rounded-xl"
                      title="Resume PDF Viewer"
                    >
                      <div className="p-6 text-center">
                        <p className="text-sm text-gray-600 mb-3">
                          Unable to render PDF inside your browser preview.
                        </p>
                        <a
                          href={resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-4 py-2 bg-[#1a1a1a] text-white text-xs font-medium rounded-lg hover:bg-black"
                        >
                          Open Resume PDF in New Tab
                        </a>
                      </div>
                    </iframe>
                  </object>
                </div>
              )}

              {/* Extracted Text or Job Description Tab */}
              {activeSourceTab !== "pdf" && (
                <div className="max-h-72 overflow-y-auto p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs font-mono text-gray-800 whitespace-pre-wrap leading-relaxed select-all">
                  {activeSourceTab === "resumeText"
                    ? resumeText || "No resume text available."
                    : jobDescription || "No job description available."}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
