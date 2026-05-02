"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Главная", icon: "◐" },
  { href: "/services", label: "Прайс", icon: "◈" },
  { href: "/portfolio", label: "Работы", icon: "◉" },
  { href: "/reviews", label: "Отзывы", icon: "◊" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 navbar">
      <div className="flex justify-around items-end px-2 pb-safe max-w-lg mx-auto h-16">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center h-full flex-1 transition-all duration-150 ${
                active ? "text-white" : "text-white/25"
              }`}
            >
              <span
                className={`text-xl mb-1.5 transition-transform ${
                  active ? "scale-110" : "scale-100"
                }`}
              >
                {item.icon}
              </span>
              <span className="text-[11px] font-medium tracking-wide">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
