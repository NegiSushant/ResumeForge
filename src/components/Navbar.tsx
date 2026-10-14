import Link from "next/link";
import { Suspense } from "react";
import NavLinks from "@/components/NavLinks";

export default function Navbar() {
  return (
    <header className="bg-[#1a1a1a] text-white">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight hover:opacity-95 transition"
        >
          Resume<span className="text-orange-400">Forge</span>
        </Link>

        <Suspense
          fallback={
            <nav className="flex items-center gap-6 sm:gap-8 text-sm">
              <Link href="/" className="text-gray-400 pb-1">
                Home
              </Link>
              <Link href="/analyze" className="text-gray-400 pb-1">
                Analyze
              </Link>
              <Link href="/history" className="text-gray-400 pb-1">
                History
              </Link>
            </nav>
          }
        >
          <NavLinks />
        </Suspense>
      </div>
    </header>
  );
}
