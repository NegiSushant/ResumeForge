"use client";

import ScoreBadge from "@/components/ScoreBadge";

interface AnalysisResult {
  fitScore: number;
  summary: string;
  matchingSkills: string[];
  missingSkills: string[];
  strengths: string[];
  weaknesses: string[];
  suggestedImprovements: { section: string; suggestion: string }[];
  keywordGaps: string[];
}

interface AnalysisResultsProps {
  analysis: AnalysisResult;
  onReset: () => void;
}

export default function AnalysisResults({
  analysis,
  onReset,
}: AnalysisResultsProps) {
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
              Powered by Gemma 3 (local)
            </p>
          </div>
          <button
            onClick={onReset}
            className="text-sm text-gray-500 hover:text-gray-800 underline"
          >
            New Analysis
          </button>
        </div>

        <div className="flex items-end gap-4 mb-6">
          <div className="text-5xl font-bold text-gray-900">
            {analysis.fitScore}
            <span className="text-2xl text-gray-400">/100</span>
          </div>
          <ScoreBadge score={analysis.fitScore} />
        </div>

        <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
      </div>

      {/* Skills */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-emerald-700 mb-3">
            Matching Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysis.matchingSkills?.length ? (
              analysis.matchingSkills.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                //   key={skill}
                  className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-full"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-sm">None detected</span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-orange-700 mb-3">Missing Skills</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.missingSkills?.length ? (
              analysis.missingSkills.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                //   key={skill}
                  className="px-3 py-1 bg-orange-50 text-orange-700 text-sm rounded-full"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-sm">None</span>
            )}
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Strengths</h3>
          <ul className="space-y-2">
            {analysis.strengths?.map((item, i) => (
              <li key={i} className="text-sm text-gray-700 flex gap-2">
                <span className="text-emerald-500">•</span> {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Weaknesses</h3>
          <ul className="space-y-2">
            {analysis.weaknesses?.map((item, i) => (
              <li key={i} className="text-sm text-gray-700 flex gap-2">
                <span className="text-orange-500">•</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Suggested Improvements
        </h3>
        <div className="space-y-4">
          {analysis.suggestedImprovements?.map((item, i) => (
            <div key={i} className="border-l-4 border-orange-400 pl-4">
              <p className="text-sm font-medium text-gray-900">
                {item.section}
              </p>
              <p className="text-sm text-gray-600 mt-1">{item.suggestion}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Keyword Gaps */}
      {analysis.keywordGaps?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Keyword Gaps</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.keywordGaps.map((kw) => (
              <span
                key={kw}
                className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
