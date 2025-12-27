// app/dashboard/store/layout.tsx
"use client";

import StoreSidebar from "../../../components/StoreSidebar";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <StoreSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
