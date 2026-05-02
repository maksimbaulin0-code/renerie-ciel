"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Главная", icon: "✦" },
  { href: "/services", label: "Услуги", icon: "◇" },
  { href: "/portfolio", label: "Работы", icon: "◧" },
  { href: "/reviews", label: "Отзывы", icon: "♡" },
];

export default function Navbar() {
  const pathname = usePathname();
  if (pathname === "/admin") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 navbar">
      <div className="flex justify-around items-center py-2 px-4 max-w-lg mx-auto">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`navbar-item ${active ? "navbar-item-active" : ""}`}
            >
              <span className={`navbar-icon text-base transition-all`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
