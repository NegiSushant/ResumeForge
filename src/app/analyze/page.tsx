"use client";

import { useState } from "react";
import ResumeUpload from "@/components/ResumeUpload";
import JobDescriptionInput from "@/components/JobDescriptionInput";
import AnalysisResults from "@/components/AnalysisResults";

interface AnalysisResult {
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

export default function AnalyzePage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analysisResumeText, setAnalysisResumeText] = useState("");
  const [analysisResumeUrl, setAnalysisResumeUrl] = useState<string | null>(null);
  const [analysisJdText, setAnalysisJdText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"upload" | "results">("upload");

  async function handleResumeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeFile(file);
    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resumes", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload resume");

      setResumeId(data.resumeId);
      setAnalysisResumeUrl(`/api/resumes/${data.resumeId}/file`);
      if (data.extractedText) {
        setAnalysisResumeText(data.extractedText);
      }
    } catch (err: any) {
      setError(err.message || "Upload failed");
      setResumeFile(null);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleAnalyze() {
    if (!resumeId || !jdText.trim()) {
      setError("Please upload a resume and paste a job description");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId,
          jdText: jdText.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");

      setAnalysis(data.analysis);
      if (data.resumeUrl) {
        setAnalysisResumeUrl(data.resumeUrl);
      } else if (resumeId) {
        setAnalysisResumeUrl(`/api/resumes/${resumeId}/file`);
      }
      if (data.resumeText) {
        setAnalysisResumeText(data.resumeText);
      }
      setAnalysisJdText(data.jobDescription || jdText.trim());
      setStep("results");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsAnalyzing(false);
    }
  }

  function reset() {
    setResumeFile(null);
    setJdText("");
    setResumeId(null);
    setAnalysis(null);
    setAnalysisResumeText("");
    setAnalysisResumeUrl(null);
    setAnalysisJdText("");
    setError(null);
    setStep("upload");
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex flex-col">
      <main className="flex-1 max-w-3xl mx-auto px-6 py-10 w-full">
        {step === "upload" ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Analyze Resume
              </h1>
              <p className="text-gray-500 mb-8">
                Upload your resume and paste the job description. Everything
                stays local.
              </p>

              <ResumeUpload
                resumeFile={resumeFile}
                isUploading={isUploading}
                onUpload={handleResumeUpload}
              />

              <JobDescriptionInput value={jdText} onChange={setJdText} />

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={!resumeId || !jdText.trim() || isAnalyzing}
                className="w-full bg-[#1a1a1a] text-white py-3.5 rounded-xl font-medium hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isAnalyzing ? "Analyzing with local AI..." : "Run Analysis"}
              </button>
            </div>
          </div>
        ) : (
          analysis && (
            <AnalysisResults
              analysis={analysis}
              resumeText={analysisResumeText}
              resumeUrl={analysisResumeUrl || undefined}
              jobDescription={analysisJdText}
              onReset={reset}
            />
          )
        )}
      </main>
    </div>
  );
}