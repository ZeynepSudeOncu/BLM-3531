"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/http";
import { useRouter } from "next/navigation";

interface DepotProduct {
  id: string;        // DepotProducts.Id
  productId: string; // Products.Id
  name: string;
  code: string;
  quantity: number;

  lastOutDate?: string;
  lastUpdateDate?: string;
  
}

export default function DepotProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<DepotProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const criticalCount = products.filter(
    p => getStockStatus(p.quantity).type === "critical"
  ).length;
  
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/depot-products/my") // 🔥 DEĞİŞTİ
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          setError("Depo ürünleri alınamadı");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  // ✅ TOPLAM STOK (artık doğru yerden)
  const totalQuantity = products.reduce(
    (sum, p) => sum + p.quantity,
    0
  );


  function getStockStatus(quantity: number) {
    if (quantity <= 15) {
      return {
        type: "critical",
        label: "Kritik",
        color: "text-red-600",
        bg: "bg-red-100",
        icon: "🔴",
      };
    }
  
    if (quantity < 30) {
      return {
        type: "warning",
        label: "Azalıyor",
        color: "text-yellow-600",
        bg: "bg-yellow-100",
        icon: "🟡",
      };
    }
  
    return {
      type: "ok",
      label: "Yeterli",
      color: "text-green-600",
      bg: "bg-green-100",
      icon: "🟢",
    };
  }

  
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Depo Ürünleri</h2>

      {/* ÖZET */}
      <div className="flex gap-4">
        <div className="bg-gray-100 rounded-lg p-4 w-64">
          <p className="text-sm text-gray-500">Toplam Stok</p>
          <p className="text-2xl font-bold">{totalQuantity}</p>
        </div>

        <div className="bg-gray-100 rounded-lg p-4 w-64">
          <p className="text-sm text-gray-500">Ürün Çeşidi</p>
          <p className="text-2xl font-bold">{products.length}</p>
        </div>
      </div>
      <div className="bg-red-100 rounded-lg p-4 w-64">
        <p className="text-sm text-red-600">Kritik Ürün</p>
        <p className="text-2xl font-bold text-red-700">
          {criticalCount}
        </p>
      </div>


      {/* TABLO */}
      <table className="w-full border border-gray-200 bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2 text-left">Ürün</th>
            <th className="border px-3 py-2 text-left">Kod</th>
            <th className="border px-3 py-2 text-right">Stok</th>
            <th className="border px-3 py-2 text-left">Durum</th>
          </tr>
        </thead>

        <tbody>
  {products.map(p => {
    const status = getStockStatus(p.quantity);

    return (
        <tr
          key={p.id}
          onClick={() => router.push(`/dashboard/depot/products/${p.productId}`)}
          className="hover:bg-gray-50 cursor-pointer"
        >
        <td className="border px-3 py-2">{p.name}</td>
        <td className="border px-3 py-2">{p.code}</td>
        <td className="border px-3 py-2 text-right">
          {p.quantity}
        </td>
        <td className="border px-3 py-2">
          <span
            className={`inline-flex items-center gap-2 px-2 py-1 rounded text-sm font-medium ${status.color} ${status.bg}`}
          >
            <span>{status.icon}</span>
            {status.label}
          </span>
        </td>
      </tr>
    );
  })}
</tbody>

      </table>
    </div>
  );
}
