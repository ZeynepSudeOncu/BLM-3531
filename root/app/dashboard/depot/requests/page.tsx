"use client";

import { useEffect, useMemo, useState } from "react";
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

type TruckItem = {
  id: string;
  plate: string;
};

export default function DepotRequestsPage() {
  const [items, setItems] = useState<ReqItem[]>([]);
  const [trucks, setTrucks] = useState<TruckItem[]>([]);
  const [selectedTruckByReq, setSelectedTruckByReq] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [allStoreRequests, setAllStoreRequests] = useState<ReqItem[]>([]);
const [loadingAll, setLoadingAll] = useState(false);


  const load = async () => {
    setLoading(true);
    try {
      const [reqRes, truckRes] = await Promise.all([
        api.get("/depot-requests/my", { params: { status: "Pending" } }),
        api.get("/trucks"), // sende trucks list endpoint'in var diye varsayıyorum
      ]);

      setItems(reqRes.data);
      setTrucks(truckRes.data);

      // default truck seçimi (ilk kamyon)
      setSelectedTruckByReq((prev) => {
        const next = { ...prev };
        for (const r of reqRes.data as ReqItem[]) {
          if (!next[r.id] && (truckRes.data?.length ?? 0) > 0) {
            next[r.id] = truckRes.data[0].id;
          }
        }
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    loadAllStoreRequests();
  }, []);
  

  const approve = async (id: string) => {
    try {
      const truckId = selectedTruckByReq[id];
      if (!truckId) {
        alert("Lütfen kamyon seç.");
        return;
      }

      await api.patch(`/depot-requests/${id}/approve`, { truckId });
      await load();
      alert("Onaylandı");
    } catch (e: any) {
      alert(e?.response?.data ?? "Onaylanamadı");
    }
  };

  const reject = async (id: string) => {
    try {
      await api.patch(`/depot-requests/${id}/reject`);
      await load();
      alert("Reddedildi");
    } catch (e: any) {
      alert(e?.response?.data ?? "Reddedilemedi");
    }
  };

  const loadAllStoreRequests = async () => {
    setLoadingAll(true);
    try {
      const res = await api.get("/depot-requests/store-requests");
      setAllStoreRequests(res.data);
    } finally {
      setLoadingAll(false);
    }
  };

  const statusTrMap: Record<string, string> = {
    Pending: "Beklemede",
    Approved: "Onaylandı",
    OnTheWay: "Yolda",
    InTransit: "Yolda",
    Delivered: "Teslim Edildi",
    Rejected: "Reddedildi",
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
              <th className="p-3 text-left">Kamyon</th>
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
                <td className="p-3">{new Date(x.createdAt).toLocaleString("tr-TR")}</td>

                <td className="p-3">
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={selectedTruckByReq[x.id] ?? ""}
                    onChange={(e) =>
                      setSelectedTruckByReq((p) => ({ ...p, [x.id]: e.target.value }))
                    }
                  >
                    {trucks.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.plate}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="p-3 text-center">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => approve(x.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                    >
                      Onayla
                    </button>
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
                <td className="p-4 text-gray-500" colSpan={7}>
                  Bekleyen talep yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* ================= STORE TALEPLERİ (TÜM DURUMLAR) ================= */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">
          Store Talepleri (Tüm Durumlar)
        </h2>

        {loadingAll ? (
          <div>Yükleniyor...</div>
        ) : (
          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Mağaza</th>
                  <th className="p-3 text-left">Ürün</th>
                  <th className="p-3 text-right">Miktar</th>
                  <th className="p-3 text-left">Durum</th>
                  <th className="p-3 text-left">Tarih</th>
                </tr>
              </thead>

              <tbody>
                {allStoreRequests.map((x) => (
                  <tr key={x.id} className="border-t">
                    <td className="p-3">{x.storeName}</td>
                    <td className="p-3">{x.productName}</td>
                    <td className="p-3 text-right">{x.requestedQuantity}</td>
                    <td className="p-3">
                      <span
                        className={
                          x.status === "Pending"
                            ? "text-yellow-600"
                            : x.status === "OnTheWay" || x.status === "InTransit"
                            ? "text-blue-600"
                            : x.status === "Delivered"
                            ? "text-green-600"
                            : x.status === "Rejected"
                            ? "text-red-600"
                            : ""
                        }
                      >
                        {{
                          Pending: "Beklemede",
                          Approved: "Onaylandı",
                          OnTheWay: "Yolda",
                          InTransit: "Yolda",
                          Delivered: "Teslim Edildi",
                          Rejected: "Reddedildi",
                        }[x.status] ?? x.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {new Date(x.createdAt).toLocaleString("tr-TR")}
                    </td>
                  </tr>
                ))}

                {allStoreRequests.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-gray-500">
                      Kayıt yok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
