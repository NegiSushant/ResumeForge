"use client";

import { useState } from "react";
import ResumeUpload from "@/components/ResumeUpload";
import JobDescriptionInput from "@/components/JobDescriptionInput";
import AnalysisResults from "@/components/AnalysisResults";

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

export default function AnalyzePage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
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
                className="w-full bg-[#1a1a1a] text-white py-3.5 rounded-xl font-medium hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? "Analyzing with local AI..." : "Run Analysis"}
              </button>
            </div>
          </div>
        ) : (
          analysis && <AnalysisResults analysis={analysis} onReset={reset} />
        )}
      </main>
    </div>
  );
}

// "use client";

// import { useState } from "react";

// interface AnalysisResult {
//   fitScore: number;
//   summary: string;
//   matchingSkills: string[];
//   missingSkills: string[];
//   strengths: string[];
//   weaknesses: string[];
//   suggestedImprovements: { section: string; suggestion: string }[];
//   keywordGaps: string[];
// }

// export default function AnalyzePage() {
//   const [resumeFile, setResumeFile] = useState<File | null>(null);
//   const [jdText, setJdText] = useState("");
//   const [isUploading, setIsUploading] = useState(false);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [resumeId, setResumeId] = useState<string | null>(null);
//   const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [step, setStep] = useState<"upload" | "results">("upload");

//   // ---------- Upload Resume ----------
//   async function handleResumeUpload(e: React.ChangeEvent<HTMLInputElement>) {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setResumeFile(file);
//     setError(null);
//     setIsUploading(true);

//     try {
//       const formData = new FormData();
//       formData.append("file", file);

//       const res = await fetch("/api/resumes", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Failed to upload resume");
//       }

//       setResumeId(data.resumeId);
//     } catch (err: any) {
//       setError(err.message || "Upload failed");
//       setResumeFile(null);
//     } finally {
//       setIsUploading(false);
//     }
//   }

//   // ---------- Run Analysis ----------
//   async function handleAnalyze() {
//     if (!resumeId || !jdText.trim()) {
//       setError("Please upload a resume and paste a job description");
//       return;
//     }

//     setIsAnalyzing(true);
//     setError(null);

//     try {
//       const res = await fetch("/api/analyze", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           resumeId,
//           jdText: jdText.trim(),
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Analysis failed");
//       }

//       setAnalysis(data.analysis);
//       setStep("results");
//     } catch (err: any) {
//       setError(err.message || "Something went wrong");
//     } finally {
//       setIsAnalyzing(false);
//     }
//   }

//   function reset() {
//     setResumeFile(null);
//     setJdText("");
//     setResumeId(null);
//     setAnalysis(null);
//     setError(null);
//     setStep("upload");
//   }

//   return (
//     <div className="min-h-screen bg-[#f5f0e8]">
//       <main className="max-w-3xl mx-auto px-6 py-10">
//         {step === "upload" ? (
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//             <div className="p-8">
//               <h1 className="text-2xl font-bold text-gray-900 mb-1">
//                 Analyze Resume
//               </h1>
//               <p className="text-gray-500 mb-8">
//                 Upload your resume and paste the job description. Everything
//                 stays local.
//               </p>

//               {/* Resume Upload */}
//               <div className="mb-8">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   1. Upload Resume (PDF or DOCX)
//                 </label>
//                 <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-orange-300 transition">
//                   <input
//                     type="file"
//                     accept=".pdf,.docx"
//                     onChange={handleResumeUpload}
//                     className="hidden"
//                     id="resume-upload"
//                     disabled={isUploading}
//                   />
//                   <label htmlFor="resume-upload" className="cursor-pointer">
//                     {isUploading ? (
//                       <p className="text-gray-500">
//                         Uploading & extracting text...
//                       </p>
//                     ) : resumeFile ? (
//                       <div>
//                         <p className="font-medium text-gray-900">
//                           {resumeFile.name}
//                         </p>
//                         <p className="text-sm text-emerald-600 mt-1">✓ Ready</p>
//                       </div>
//                     ) : (
//                       <div>
//                         <p className="text-gray-600">
//                           Click to upload or drag and drop
//                         </p>
//                         <p className="text-sm text-gray-400 mt-1">
//                           PDF or DOCX • Max 5MB
//                         </p>
//                       </div>
//                     )}
//                   </label>
//                 </div>
//               </div>

//               {/* Job Description */}
//               <div className="mb-8">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   2. Job Description
//                 </label>
//                 <textarea
//                   value={jdText}
//                   onChange={(e) => setJdText(e.target.value)}
//                   placeholder="Paste the full job description here..."
//                   rows={8}
//                   className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
//                 />
//               </div>

//               {error && (
//                 <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm">
//                   {error}
//                 </div>
//               )}

//               <button
//                 onClick={handleAnalyze}
//                 disabled={!resumeId || !jdText.trim() || isAnalyzing}
//                 className="w-full bg-[#1a1a1a] text-white py-3.5 rounded-xl font-medium hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isAnalyzing ? "Analyzing with local AI..." : "Run Analysis"}
//               </button>
//             </div>
//           </div>
//         ) : (
//           // ---------- Results View ----------
//           <div className="space-y-6">
//             {/* Score Card */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
//               <div className="flex items-center justify-between mb-6">
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900">
//                     Analysis Result
//                   </h2>
//                   <p className="text-gray-500 text-sm mt-1">
//                     Powered by Gemma 3 (local)
//                   </p>
//                 </div>
//                 <button
//                   onClick={reset}
//                   className="text-sm text-gray-500 hover:text-gray-800 underline"
//                 >
//                   New Analysis
//                 </button>
//               </div>

//               <div className="flex items-end gap-4 mb-6">
//                 <div className="text-5xl font-bold text-gray-900">
//                   {analysis?.fitScore}
//                   <span className="text-2xl text-gray-400">/100</span>
//                 </div>
//                 <div
//                   className={`px-3 py-1 rounded-full text-sm font-medium ${
//                     (analysis?.fitScore || 0) >= 70
//                       ? "bg-emerald-50 text-emerald-700"
//                       : (analysis?.fitScore || 0) >= 40
//                         ? "bg-orange-50 text-orange-700"
//                         : "bg-red-50 text-red-700"
//                   }`}
//                 >
//                   {(analysis?.fitScore || 0) >= 70
//                     ? "Strong Match"
//                     : (analysis?.fitScore || 0) >= 40
//                       ? "Moderate Match"
//                       : "Weak Match"}
//                 </div>
//               </div>

//               <p className="text-gray-700 leading-relaxed">
//                 {analysis?.summary}
//               </p>
//             </div>

//             {/* Skills */}
//             <div className="grid sm:grid-cols-2 gap-4">
//               <div className="bg-white rounded-2xl border border-gray-100 p-6">
//                 <h3 className="font-semibold text-emerald-700 mb-3">
//                   Matching Skills
//                 </h3>
//                 <div className="flex flex-wrap gap-2">
//                   {analysis?.matchingSkills?.length ? (
//                     analysis.matchingSkills.map((skill) => (
//                       <span
//                         key={skill}
//                         className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-full"
//                       >
//                         {skill}
//                       </span>
//                     ))
//                   ) : (
//                     <span className="text-gray-400 text-sm">None detected</span>
//                   )}
//                 </div>
//               </div>

//               <div className="bg-white rounded-2xl border border-gray-100 p-6">
//                 <h3 className="font-semibold text-orange-700 mb-3">
//                   Missing Skills
//                 </h3>
//                 <div className="flex flex-wrap gap-2">
//                   {analysis?.missingSkills?.length ? (
//                     analysis.missingSkills.map((skill) => (
//                       <span
//                         key={skill}
//                         className="px-3 py-1 bg-orange-50 text-orange-700 text-sm rounded-full"
//                       >
//                         {skill}
//                       </span>
//                     ))
//                   ) : (
//                     <span className="text-gray-400 text-sm">None</span>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Strengths & Weaknesses */}
//             <div className="grid sm:grid-cols-2 gap-4">
//               <div className="bg-white rounded-2xl border border-gray-100 p-6">
//                 <h3 className="font-semibold text-gray-900 mb-3">Strengths</h3>
//                 <ul className="space-y-2">
//                   {analysis?.strengths?.map((item, i) => (
//                     <li key={i} className="text-sm text-gray-700 flex gap-2">
//                       <span className="text-emerald-500">•</span> {item}
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               <div className="bg-white rounded-2xl border border-gray-100 p-6">
//                 <h3 className="font-semibold text-gray-900 mb-3">Weaknesses</h3>
//                 <ul className="space-y-2">
//                   {analysis?.weaknesses?.map((item, i) => (
//                     <li key={i} className="text-sm text-gray-700 flex gap-2">
//                       <span className="text-orange-500">•</span> {item}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>

//             {/* Suggestions */}
//             <div className="bg-white rounded-2xl border border-gray-100 p-6">
//               <h3 className="font-semibold text-gray-900 mb-4">
//                 Suggested Improvements
//               </h3>
//               <div className="space-y-4">
//                 {analysis?.suggestedImprovements?.map((item, i) => (
//                   <div key={i} className="border-l-4 border-orange-400 pl-4">
//                     <p className="text-sm font-medium text-gray-900">
//                       {item.section}
//                     </p>
//                     <p className="text-sm text-gray-600 mt-1">
//                       {item.suggestion}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Keyword Gaps */}
//             {analysis?.keywordGaps && analysis.keywordGaps.length > 0 && (
//               <div className="bg-white rounded-2xl border border-gray-100 p-6">
//                 <h3 className="font-semibold text-gray-900 mb-3">
//                   Keyword Gaps
//                 </h3>
//                 <div className="flex flex-wrap gap-2">
//                   {analysis.keywordGaps.map((kw) => (
//                     <span
//                       key={kw}
//                       className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full"
//                     >
//                       {kw}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
