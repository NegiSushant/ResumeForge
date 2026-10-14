"use client";

import { useState } from "react";
import ScoreBadge from "@/components/ScoreBadge";

interface SampleCase {
  role: string;
  score: number;
  summary: string;
  matchingSkills: string[];
  missingSkills: string[];
  strengths: string[];
  suggestedImprovement: { section: string; suggestion: string };
  keywordGaps: string[];
}

const SAMPLE_CASES: SampleCase[] = [
  {
    role: "Senior Full Stack Engineer",
    score: 87,
    summary:
      "Strong technical alignment with React, Next.js, and Node.js microservices. Good demonstration of architectural leadership, but lacks explicit details on Kubernetes deployment and telemetry.",
    matchingSkills: [
      "TypeScript",
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "Tailwind CSS",
    ],
    missingSkills: ["Kubernetes", "OpenTelemetry", "Redis Caching"],
    strengths: [
      "Extensive experience building responsive web apps with Next.js App Router",
      "Proven track record scaling backend REST endpoints for 50k+ users",
    ],
    suggestedImprovement: {
      section: "Experience · Cloud Infrastructure",
      suggestion:
        "Explicitly quantify container orchestration or CI/CD pipelines used in your latest role to satisfy the DevOps criteria.",
    },
    keywordGaps: ["distributed tracing", "helm charts", "SLA monitoring"],
  },
  {
    role: "AI / ML Solutions Developer",
    score: 92,
    summary:
      "Outstanding alignment with local LLM deployments, RAG pipelines, and Python frameworks. Seamless match for the open-weight model integration requirements.",
    matchingSkills: [
      "Python",
      "Gemma 3",
      "Docker",
      "Vector Search",
      "FastAPI",
    ],
    missingSkills: ["Kubeflow", "Triton Server"],
    strengths: [
      "Deep practical experience quantizing and deploying open-weight LLMs locally",
      "Clean system design adhering to strict data privacy constraints",
    ],
    suggestedImprovement: {
      section: "Projects · Inference Benchmarks",
      suggestion:
        "Add tokens-per-second and memory footprint metrics for your quantized local model benchmarks.",
    },
    keywordGaps: ["model pruning", "vLLM", "batch inference"],
  },
];

export default function SampleReportPreview() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const current = SAMPLE_CASES[selectedIdx];

  return (
    <section className="mt-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full">
            Instant Preview
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mt-2">
            What You Get in Every Analysis
          </h2>
          <p className="mt-2 text-gray-600 text-sm">
            Actionable feedback structured exactly how technical hiring teams
            evaluate candidates.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-xs">
          {SAMPLE_CASES.map((item, idx) => (
            <button
              key={item.role}
              onClick={() => setSelectedIdx(idx)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                selectedIdx === idx
                  ? "bg-[#1a1a1a] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {item.role}
            </button>
          ))}
        </div>
      </div>

      {/* Preview Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
          <div>
            <div className="text-sm font-semibold text-gray-900">
              Role: <span className="text-orange-600">{current.role}</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Parsed locally by Gemma 3 · 0ms cloud latency
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-4xl font-bold text-gray-900">
              {current.score}
              <span className="text-xl text-gray-400">/100</span>
            </div>
            <ScoreBadge score={current.score} />
          </div>
        </div>

        <p className="text-gray-700 text-sm leading-relaxed my-5">
          {current.summary}
        </p>

        {/* Skills Comparison */}
        <div className="grid sm:grid-cols-2 gap-4 my-5">
          <div className="bg-emerald-50/50 rounded-xl border border-emerald-100 p-4">
            <h4 className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-2.5">
              Matching Skills ({current.matchingSkills.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {current.matchingSkills.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 bg-white text-emerald-700 text-xs font-medium rounded-md border border-emerald-200"
                >
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-orange-50/50 rounded-xl border border-orange-100 p-4">
            <h4 className="text-xs font-semibold text-orange-800 uppercase tracking-wide mb-2.5">
              Missing from Resume ({current.missingSkills.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {current.missingSkills.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 bg-white text-orange-700 text-xs font-medium rounded-md border border-orange-200"
                >
                  ✕ {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Suggested improvement & keywords */}
        <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="sm:col-span-2 border-l-4 border-orange-400 pl-4 py-1">
            <span className="text-xs font-semibold text-gray-500 uppercase">
              Targeted Improvement
            </span>
            <p className="text-sm font-semibold text-gray-900 mt-0.5">
              {current.suggestedImprovement.section}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {current.suggestedImprovement.suggestion}
            </p>
          </div>

          <div className="bg-purple-50/50 rounded-xl border border-purple-100 p-3">
            <span className="text-xs font-semibold text-purple-800 uppercase block mb-1.5">
              ATS Keyword Gaps
            </span>
            <div className="flex flex-wrap gap-1">
              {current.keywordGaps.map((kw) => (
                <span
                  key={kw}
                  className="px-2 py-0.5 bg-white text-purple-700 text-[11px] font-medium rounded border border-purple-200"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
