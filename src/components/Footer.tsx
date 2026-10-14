import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-gray-400 mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <div className="text-white text-lg font-semibold tracking-tight">
              Resume<span className="text-orange-400">Forge</span>
            </div>
            <p className="text-sm mt-1 text-gray-500">
              Local AI resume analysis • Privacy first
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8 text-sm">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <Link href="/analyze" className="hover:text-white transition">
              Analyze
            </Link>
            <Link href="/history" className="hover:text-white transition">
              History
            </Link>
          </div>
        </div>

        {/* Bottom line */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>Built with Next.js + Docker Model Runner + Gemma 3</p>
          <p>Open-source AI • Your data never leaves your machine</p>
        </div>
      </div>
    </footer>
  );
}
