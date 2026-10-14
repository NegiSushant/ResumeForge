import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="mt-16 mb-8">
      <div className="bg-[#1a1a1a] text-white rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <span className="text-xs uppercase tracking-wider font-semibold text-orange-400 bg-orange-950/60 border border-orange-500/30 px-3 py-1 rounded-full">
            Zero setup required
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-4">
            Ready to tailor your resume with 100% privacy?
          </h2>
          <p className="mt-3 text-gray-400 text-sm sm:text-base leading-relaxed">
            Upload your resume now and benchmark it against your dream job
            description in seconds. No login, no cloud, no fees.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/analyze"
              className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-7 py-3 rounded-xl font-medium hover:bg-orange-600 transition shadow-sm text-sm"
            >
              Analyze Your Resume Now
            </Link>
            <Link
              href="/history"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-7 py-3 rounded-xl font-medium hover:bg-white/20 transition text-sm border border-white/10"
            >
              View Past Analyses
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
