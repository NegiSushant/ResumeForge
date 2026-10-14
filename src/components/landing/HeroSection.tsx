import Link from "next/link";

export default function HeroSection() {
  return (
    <section>
      {/* Hero Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 sm:p-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                Tailor your resume
                <br />
                <span className="text-orange-500">with open-source AI</span>
              </h1>
              <p className="mt-4 text-gray-600 text-lg leading-relaxed max-w-lg">
                Upload your resume + job description. Get a private, local
                analysis powered by open-weight models. Your data never leaves
                your machine.
              </p>
            </div>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 mt-8">
            <span className="px-3 py-1.5 bg-orange-50 text-orange-700 text-sm font-medium rounded-full">
              100% Local
            </span>
            <span className="px-3 py-1.5 bg-purple-50 text-purple-700 text-sm font-medium rounded-full">
              Open-weight AI
            </span>
            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full">
              Privacy first
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/analyze"
              className="inline-flex items-center justify-center gap-2 bg-[#1a1a1a] text-white px-8 py-3.5 rounded-xl font-medium hover:bg-black transition shadow-sm"
            >
              Start Analysis
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-800 px-8 py-3.5 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition"
            >
              How it works
            </a>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="bg-gray-50 border-t border-gray-100 px-8 py-4 flex items-center justify-between text-sm text-gray-500">
          <span>Powered by Gemma 3 · Docker Model Runner</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Ready
          </span>
        </div>
      </div>

      {/* 3 Quick Step Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mt-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:border-orange-200 transition">
          <div className="text-orange-500 font-semibold text-sm mb-1">
            1. Upload
          </div>
          <p className="text-gray-600 text-sm">
            Resume (PDF/DOCX) + Job Description
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:border-purple-200 transition">
          <div className="text-purple-500 font-semibold text-sm mb-1">
            2. Analyze
          </div>
          <p className="text-gray-600 text-sm">
            Local open-weight model does the work
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:border-emerald-200 transition">
          <div className="text-emerald-500 font-semibold text-sm mb-1">
            3. Improve
          </div>
          <p className="text-gray-600 text-sm">
            Get fit score + concrete suggestions
          </p>
        </div>
      </div>
    </section>
  );
}
