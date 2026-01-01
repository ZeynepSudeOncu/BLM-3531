"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/http";

type MeResponse = {
  driverName: string;
  truckPlate: string | null;
  truckStatus: string | null;
  totalLoad: number;
};

export default function DriverDashboardPage() {
  const router = useRouter();
  const [totalLoad, setTotalLoad] = useState<number>(0);


  const [me, setMe] = useState<MeResponse | null>(null);
  const [deliveriesCount, setDeliveriesCount] = useState<number>(0);

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

        // 1) /api/driver/me
        const meRes = await api.get("/driver/me");
        setMe(meRes.data);

        // 2) /api/driver/deliveries/my  (404 dönse bile sayfa ayakta kalsın)
        try {
          const delRes = await api.get("/driver/deliveries/my");
          const arr = Array.isArray(delRes.data) ? delRes.data : [];
          setDeliveriesCount(arr.length);
        } catch (e: any) {
          setDeliveriesCount(0);
          // 404 vb. olursa sadece bilgi amaçlı gösteriyoruz
          setError("Sürücüye atanmış kamyon yok");
        }

        // 3) Kamyon yükü
const loadsRes = await api.get("/truck-loads");
const loads = Array.isArray(loadsRes.data) ? loadsRes.data : [];

const myTruck = loads.find(
  (t: any) => t.plate === meRes.data.truckPlate
);

setTotalLoad(myTruck?.used ?? 0);

      } catch (e: any) {
        if (e?.response?.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }
        setError("Driver bilgisi alınamadı.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  if (loading) return <div className="text-gray-600">Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Ana Sayfa</h1>
      </div>

      {error && (
        <div className="border border-red-200 bg-red-50 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <Card title="Atanmış Kamyon" value={me?.truckPlate ? "Var" : "Yok"} />
  <Card title="Kamyon Plakası" value={me?.truckPlate ?? "-"} />
  <Card title="Toplam Yük (Adet)" value={String(totalLoad)} />

</div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Toplam Teslimat Sayısı" value={String(deliveriesCount)} />
        <div className="border rounded-2xl p-5 bg-white">
          <div className="text-sm text-gray-500 mb-1">Sürücü</div>
          <div className="text-lg font-semibold">{me?.driverName ?? "-"}</div>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  value,
  highlight,
}: {
  title: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`border rounded-2xl p-5 bg-white ${
        highlight ? "border-yellow-400 bg-yellow-50" : ""
      }`}
    >
      <div className="text-sm text-gray-500 mb-1">{title}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}

