"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Ana Sayfa", href: "/dashboard/driver" },
  { label: "Teslimatlarım", href: "/dashboard/driver/deliveries" },
];

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-gray-50 min-h-screen px-4 py-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              D
            </div>
            <div className="font-semibold text-lg">Driver Panel</div>
          </div>

          <nav className="flex flex-col gap-2">
            {items.map((it) => {
              const active =
                pathname === it.href || (it.href !== "/dashboard/driver" && pathname?.startsWith(it.href));

              return (
                <Link
                  key={it.href}
                  href={it.href as any}
                  className={[
                    "px-4 py-3 rounded-xl text-sm font-medium transition",
                    active
                      ? "bg-indigo-600 text-white"
                      : "text-gray-700 hover:bg-gray-100",
                  ].join(" ")}
                >
                  {it.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
