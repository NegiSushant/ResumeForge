"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function NavLinks() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const navLinks = [
    {
      label: "Home",
      href: "/",
      isActive: pathname === "/",
    },
    {
      label: "Analyze",
      href: "/analyze",
      isActive: pathname.startsWith("/analyze"),
    },
    {
      label: "History",
      href: "/history",
      isActive: pathname.startsWith("/history"),
    },
  ];

  return (
    <div className="flex items-center gap-5 sm:gap-8">
      <nav className="flex items-center gap-5 sm:gap-8 text-sm">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`pb-1 transition ${
              link.isActive
                ? "text-white border-b-2 border-white font-medium"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3 text-sm border-l border-gray-800 pl-4 sm:pl-6">
        {status === "loading" ? (
          <span className="text-gray-500 text-xs">...</span>
        ) : session?.user ? (
          <div className="flex items-center gap-3">
            <span className="text-gray-300 font-medium text-xs sm:text-sm max-w-[120px] truncate">
              {session.user.name || session.user.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/signin"
              className="px-3 py-1.5 rounded-lg text-gray-300 hover:text-white text-xs font-medium transition"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium transition shadow-xs"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
