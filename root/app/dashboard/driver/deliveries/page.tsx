"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/http";

type DeliveryItem = {
  id: string;
  storeName: string;
  productName: string;
  productCode: string;
  requestedQuantity: number;
  status: string;
  createdAt: string;
  pickedUpAt?: string;
  deliveredAt?: string;
};

export default function DriverDeliveriesPage() {
  const [items, setItems] = useState<DeliveryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/driver/deliveries/my");
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const pickup = async (id: string) => {
    try {
      await api.patch(`/driver/deliveries/${id}/pickup`);
      await load();
      alert("Teslim alındı. Yola çıkıldı.");
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "Teslim alınamadı");
    }
  };

  const deliver = async (id: string) => {
    try {
      await api.patch(`/driver/deliveries/${id}/deliver`);
      await load();
      alert("Teslim edildi. İşlem tamamlandı.");
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "Teslim edilemedi");
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Teslimatlarım</h1>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Mağaza</th>
              <th className="p-3 text-left">Ürün</th>
              <th className="p-3 text-left">Kod</th>
              <th className="p-3 text-right">Adet</th>
              <th className="p-3 text-left">Durum</th>
              <th className="p-3 text-center">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {items.map((x) => (
              <tr key={x.id} className="border-t">
                <td className="p-3">{x.storeName}</td>
                <td className="p-3">{x.productName}</td>
                <td className="p-3">{x.productCode}</td>
                <td className="p-3 text-right">{x.requestedQuantity}</td>
                <td className="p-3 font-medium">
                  {x.status === "Approved" && "Onaylandı"}
                  {x.status === "InTransit" && "Yolda"}
                  {x.status === "Delivered" && "Teslim Edildi"}
                </td>
                <td className="p-3 text-center">
                  {x.status === "Approved" && (
                    <button
                      onClick={() => pickup(x.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                    >
                      Teslim Aldım
                    </button>
                  )}

                  {x.status === "InTransit" && (
                    <button
                      onClick={() => deliver(x.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                    >
                      Teslim Ettim
                    </button>
                  )}

                  {x.status === "Delivered" && (
                    <span className="text-green-700 font-semibold">
                      ✔ Tamamlandı
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td className="p-4 text-gray-500" colSpan={6}>
                  Aktif teslimat yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
