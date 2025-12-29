"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/http";

type DeliveryItem = {
  id: string;
  storeName: string;
  productName: string;
  productCode: string;
  requestedQuantity: number;
  status: string;
  truckPlate: string;
  createdAt: string;
};

export default function DriverDeliveriesPage() {
  const router = useRouter();

  const [items, setItems] = useState<DeliveryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get("/driver/deliveries/my");
        setItems(Array.isArray(res.data) ? res.data : []);
      } catch (e: any) {
        if (e?.response?.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }
        setError("Teslimatlar alınamadı. (Backend route/endpoint kontrol et)");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  if (loading) return <div className="text-gray-600">Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Deliveries</h1>

      {error && (
        <div className="border border-red-200 bg-red-50 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="border rounded-2xl overflow-hidden bg-white">
        <div className="grid grid-cols-6 gap-0 text-sm font-semibold bg-gray-50 border-b px-4 py-3">
          <div className="col-span-2">Mağaza</div>
          <div>Ürün</div>
          <div>Kod</div>
          <div>Adet</div>
          <div>Durum</div>
        </div>

        {items.length === 0 ? (
          <div className="px-4 py-6 text-gray-600">Kayıt yok.</div>
        ) : (
          items.map((x) => (
            <div key={x.id} className="grid grid-cols-6 gap-0 text-sm px-4 py-3 border-b">
              <div className="col-span-2">{x.storeName}</div>
              <div>{x.productName}</div>
              <div>{x.productCode}</div>
              <div>{x.requestedQuantity}</div>
              <div>{x.status}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
