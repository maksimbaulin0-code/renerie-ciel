"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Главная", icon: "✨" },
  { href: "/services", label: "Услуги", icon: "💅" },
  { href: "/portfolio", label: "Портфолио", icon: "📸" },
  { href: "/reviews", label: "Отзывы", icon: "💬" },
];

export default function Navbar() {
  const pathname = usePathname();

  if (pathname === "/admin") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card rounded-t-2xl border-b-0">
      <div className="flex justify-around items-center py-2 px-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
              pathname === item.href
                ? "text-[var(--accent)]"
                : "text-white/40"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
