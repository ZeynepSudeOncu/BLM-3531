// root/app/dashboard/admin/layout.tsx
import Sidebar from "@/components/ui/sidebarAdmin"; // yolu senin dosya yapına göre değişebilir
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      {/* Sidebar solda */}
      <Sidebar />

      {/* Sayfa içeriği sağda */}
      <main className="flex-1 p-6 bg-white min-h-screen">
        {children}
      </main>
    </div>
  );
}
