"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HistoryTable from "@/components/HistoryTable";

interface AnalysisItem {
  id: string;
  resumeId: string;
  jdId: string | null;
  fileName: string | null;
  fitScore: number | null;
  summary: string;
  model: string;
  createdAt: string;
}

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<AnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch("/api/analyze");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load history");
        }

        setAnalyses(data.analyses || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex flex-col">
      <main className="flex-1 max-w-5xl mx-auto px-6 py-10 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">History</h1>
            <p className="text-gray-500 text-sm mt-1">
              All your past resume analyses
            </p>
          </div>
          <Link
            href="/analyze"
            className="bg-[#1a1a1a] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-black transition"
          >
            New Analysis
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500">
            Loading history...
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-red-600">
            {error}
          </div>
        ) : analyses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <p className="text-gray-500 mb-4">No analyses yet</p>
            <Link
              href="/analyze"
              className="inline-block bg-[#1a1a1a] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-black transition"
            >
              Run your first analysis
            </Link>
          </div>
        ) : (
          <HistoryTable analyses={analyses} />
        )}
      </main>
    </div>
  );
}
