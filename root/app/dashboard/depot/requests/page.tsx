"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/http";

type ReqItem = {
  id: string;
  storeId: string;
  storeName: string;
  productId: string;
  productName: string;
  productCode: string;
  requestedQuantity: number;
  status: string;
  createdAt: string;
};

type Truck = {
  id: string;
  plate: string;
};

export default function DepotRequestsPage() {
  const [items, setItems] = useState<ReqItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔽 yeni state’ler
  const [selectedRequest, setSelectedRequest] = useState<ReqItem | null>(null);
  const [selectedTruckId, setSelectedTruckId] = useState<string>("");
  const [trucks, setTrucks] = useState<Truck[]>([]);

  // 📦 talepleri çek (MEVCUT AKIŞ – BOZULMADI)
  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/depot-requests/my", {
        params: { status: "Pending" },
      });
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  };

  // 🚚 kamyonları çek
  const loadTrucks = async () => {
    const res = await api.get("/trucks");
    setTrucks(res.data);
  };

  useEffect(() => {
    load();
    loadTrucks();
  }, []);

  // ❌ ESKİ approve YOK (bilerek sildik)

  // ✅ kamyonla onay
  const approveWithTruck = async () => {
    if (!selectedRequest || !selectedTruckId) return;

    try {
      await api.patch(
        `/depot-requests/${selectedRequest.id}/approve`,
        { truckId: selectedTruckId }
      );

      setSelectedRequest(null);
      setSelectedTruckId("");

      await load();
      alert("Talep onaylandı ve kamyon atandı");
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "Onaylanamadı");
    }
  };

  // ❌ reddet AKIŞI AYNI KALDI
  const reject = async (id: string) => {
    try {
      await api.patch(`/depot-requests/${id}/reject`);
      await load();
      alert("Reddedildi");
    } catch (e: any) {
      alert(e?.response?.data ?? "Reddedilemedi");
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Gelen Talepler</h1>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Mağaza</th>
              <th className="p-3 text-left">Ürün</th>
              <th className="p-3 text-left">Kod</th>
              <th className="p-3 text-right">Miktar</th>
              <th className="p-3 text-left">Tarih</th>
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
                <td className="p-3">
                  {new Date(x.createdAt).toLocaleString("tr-TR")}
                </td>
                <td className="p-3 text-center">
                  <div className="flex gap-2 justify-center">
                    {/* ✅ ONAYLA → MODAL AÇAR */}
                    <button
                      onClick={() => setSelectedRequest(x)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                    >
                      Onayla
                    </button>

                    {/* ❌ REDDET AYNI */}
                    <button
                      onClick={() => reject(x.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                    >
                      Reddet
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td className="p-4 text-gray-500" colSpan={6}>
                  Bekleyen talep yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🟢 KAMYON SEÇ MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded w-96">
            <h2 className="text-lg font-semibold mb-3">Kamyon Seç</h2>

            <select
              className="border w-full p-2 mb-3"
              value={selectedTruckId}
              onChange={(e) => setSelectedTruckId(e.target.value)}
            >
              <option value="">Kamyon seç</option>
              {trucks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.plate}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 border"
                onClick={() => {
                  setSelectedRequest(null);
                  setSelectedTruckId("");
                }}
              >
                İptal
              </button>

              <button
                className="px-3 py-1 bg-green-600 text-white rounded"
                disabled={!selectedTruckId}
                onClick={approveWithTruck}
              >
                Onayla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
