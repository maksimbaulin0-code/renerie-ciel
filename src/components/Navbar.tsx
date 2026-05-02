"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Главная" },
  { href: "/services", label: "Прайс" },
  { href: "/portfolio", label: "Работы" },
  { href: "/reviews", label: "Отзывы" },
];

export default function Navbar() {
  const pathname = usePathname();
  if (pathname === "/admin") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 navbar">
      <div className="flex justify-around items-center py-3 px-4 max-w-lg mx-auto">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[11px] font-medium tracking-wide transition-colors ${
                active ? "text-white" : "text-white/25"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
