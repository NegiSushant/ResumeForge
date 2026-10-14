"use client";

import { use, useEffect, useState, Suspense } from "react";
import Link from "next/link";
import AnalysisResults from "@/components/AnalysisResults";

interface AnalysisDetail {
  id: string;
  resumeId: string;
  jdId: string | null;
  fileName: string | null;
  analysis: {
    fitScore: number;
    summary: string;
    matchingSkills: string[];
    missingSkills: string[];
    strengths: string[];
    weaknesses: string[];
    suggestedImprovements: { section: string; suggestion: string }[];
    keywordGaps: string[];
  };
  model: string;
  createdAt: string;
}

interface AnalysisDetailPageProps {
  params: Promise<{ id: string }>;
}

function AnalysisDetailContent({
  params,
}: AnalysisDetailPageProps) {
  const { id } = use(params);

  const [data, setData] = useState<AnalysisDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/analyze/${id}`);
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Failed to load analysis");
        }

        if (!cancelled) {
          setData(json);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (id) {
      load();
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  function reset() {
    setData(null);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
        <p className="text-gray-500">Loading analysis...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Analysis not found"}</p>
          <Link href="/history" className="text-sm underline">
            ← Back to History
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-6">
          <Link
            href="/history"
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            ← Back to History
          </Link>
        </div>

        <AnalysisResults analysis={data.analysis} onReset={reset} />
      </main>
    </div>
  );
}

export default function AnalysisDetailPage({
  params,
}: AnalysisDetailPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
          <p className="text-gray-500">Loading analysis...</p>
        </div>
      }
    >
      <AnalysisDetailContent params={params} />
    </Suspense>
  );
}
