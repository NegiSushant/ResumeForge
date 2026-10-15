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
            <div className="flex items-center gap-5 sm:gap-8 text-sm">
              <nav className="flex items-center gap-5 sm:gap-8">
                <span className="text-gray-400 pb-1">Home</span>
                <span className="text-gray-400 pb-1">Analyze</span>
                <span className="text-gray-400 pb-1">History</span>
              </nav>
              <div className="border-l border-gray-800 pl-4 sm:pl-6 text-xs text-gray-400">
                Sign In
              </div>
            </div>
          }
        >
          <NavLinks />
        </Suspense>
      </div>
    </header>
  );
}
