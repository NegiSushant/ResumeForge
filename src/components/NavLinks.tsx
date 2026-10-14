"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const pathname = usePathname();

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
    <nav className="flex items-center gap-6 sm:gap-8 text-sm">
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
  );
}
