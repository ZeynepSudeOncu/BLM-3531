"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/http";

type Item = {
  id: string;
  status: string;
  requestedQuantity: number;
  createdAt: string;
  pickedUpAt?: string | null;
  deliveredAt?: string | null;
  productName: string;
  productCode: string;
};

const statusText = (s: string) => {
  switch (s) {
    case "Pending": return "Onay bekleniyor";
    case "Rejected": return "Reddedildi";
    case "Approved": return "Onaylandı";
    case "InTransit": return "Yolda";
    case "Delivered": return "Tamamlandı";
    default: return s;
  }
};

export default function StoreRequestsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/store-requests/my");
      setItems(res.data);
    } catch (e: any) {
      alert(e?.response?.data ?? "Talepler alınamadı");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Taleplerim</h1>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Ürün</th>
              <th className="p-3 text-left">Kod</th>
              <th className="p-3 text-right">Miktar</th>
              <th className="p-3 text-left">Durum</th>
              <th className="p-3 text-left">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {items.map((x) => (
              <tr key={x.id} className="border-t">
                <td className="p-3">{x.productName}</td>
                <td className="p-3">{x.productCode}</td>
                <td className="p-3 text-right">{x.requestedQuantity}</td>
                <td className="p-3">{statusText(x.status)}</td>
                <td className="p-3">{new Date(x.createdAt).toLocaleString("tr-TR")}</td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td className="p-4 text-gray-500" colSpan={5}>
                  Henüz talep yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
