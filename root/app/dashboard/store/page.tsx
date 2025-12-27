// app/dashboard/store/page.tsx
import StatCard from "../../../components/StatCard";

export default function StoreDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Mağaza Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Toplam Ürün" value="24" />
        <StatCard title="Düşük Stok" value="3" />
        <StatCard title="Stokta Yok" value="1" />
      </div>
    </div>
  );
}
