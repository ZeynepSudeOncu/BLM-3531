"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DriverNavbar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `px-4 py-2 rounded ${
      pathname === path ? "bg-blue-600 text-white" : "text-gray-700"
    }`;

  return (
    <nav className="flex gap-4 border-b p-4">
      <Link href="/dashboard/driver" className={linkClass("/dashboard/driver")}>
        Dashboard
      </Link>

      <Link
        href="/dashboard/driver/deliveries"
        className={linkClass("/dashboard/driver/deliveries")}
      >
        Deliveries
      </Link>
    </nav>
  );
}
