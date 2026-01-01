"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/http";

/* =======================
   TYPES
======================= */

interface ProductDetail {
  id: string;
  name: string;
  code: string;
  quantity: number;
}

interface ProductMovement {
  id: string;
  storeName: string;
  requestedQuantity: number;
  status: string;
  createdAt: string;
  deliveredAt?: string | null;
}


/* =======================
   HELPERS
======================= */

function getStockStatus(quantity: number) {
  if (quantity <= 0) {
    return {
      label: "Kritik",
      color: "text-red-600",
      bg: "bg-red-100",
    };
  }

  if (quantity < 50) {
    return {
      label: "Azalıyor",
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    };
  }

  return {
    label: "Yeterli",
    color: "text-green-600",
    bg: "bg-green-100",
  };
}

/* =======================
   COMPONENT
======================= */

export default function DepotProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [movements, setMovements] = useState<ProductMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    Promise.all([
      api.get(`/depot-products/${id}`),
      api.get(`/depot-products/${id}/movements`)
    ])
      .then(([productRes, movementRes]) => {
        setProduct(productRes.data);
        setMovements(movementRes.data);
      })
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          setError("Ürün detayları alınamadı");
        }
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!product) return <p>Ürün bulunamadı</p>;

  const status = getStockStatus(product.quantity);

  const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

const last7DaysMovements = movements.filter(m =>
  new Date(m.deliveredAt ?? m.createdAt) >= sevenDaysAgo
);

const totalOut = last7DaysMovements.reduce(
  (sum, m) => sum + m.requestedQuantity,
  0
);

const dailyAverage =
  last7DaysMovements.length === 0
    ? 0
    : Math.round(totalOut / 7);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Geri
        </button>

        <h1 className="text-2xl font-semibold">
          {product.name}
        </h1>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Mevcut Stok" value={product.quantity} />
        <StatCard label="Ürün Kodu" value={product.code} />
        <StatCard label="Son 7 Gün Çıkış" value={totalOut} />
        <StatCard label="Günlük Ortalama" value={dailyAverage} />
      </div>

      {/* STATUS */}
      <div>
        <span
          className={`inline-block px-3 py-1 rounded text-sm font-medium ${status.color} ${status.bg}`}
        >
          {status.label}
        </span>
      </div>

      {/* MOVEMENTS TABLE */}
      <div className="bg-white border rounded-lg">
        <h2 className="px-4 py-3 font-semibold border-b">
          Ürün Hareket Geçmişi
        </h2>

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Mağaza</th>
              <th className="px-4 py-2 text-right">Miktar</th>
              <th className="px-4 py-2 text-left">Tarih</th>
            </tr>
          </thead>

          <tbody>
            {movements.map(m => (

              <tr key={m.id} className="border-t">
                
                <td className="px-4 py-2">{m.storeName}</td>

                
                <td className="px-4 py-2 text-right">
                {m.requestedQuantity}
</td>

<td className="px-4 py-2">
  {new Date(m.deliveredAt ?? m.createdAt).toLocaleString("tr-TR")}
</td>

              </tr>
            ))}

            {movements.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-6 text-center text-gray-400"
                >
                  Bu ürüne ait hareket kaydı yok
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =======================
   SUB COMPONENT
======================= */

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
