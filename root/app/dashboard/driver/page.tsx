// "use client";

// import { useEffect, useState } from "react";
// import { api } from "@/lib/http";
// import { useRouter } from "next/navigation";

// interface DriverProfile {
//   fullName: string;
//   truckPlate: string | null;
//   status: string;
//   totalDeliveries: number;
// }

// export default function DriverDashboardPage() {
//   const router = useRouter();
//   const [data, setData] = useState<DriverProfile | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/login");
//       return;
//     }

//     api
//       .get("/driver/me")
//       .then(res => setData(res.data))
//       .catch(() => setData(null))
//       .finally(() => setLoading(false));
//   }, [router]);

//   if (loading) return <p>Yükleniyor...</p>;

//   if (!data)
//     return <p className="text-red-500">Driver bilgisi alınamadı.</p>;

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-semibold">Driver Dashboard</h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="border rounded-lg p-4">
//           <p className="text-sm text-gray-500">Atanmış Kamyon</p>
//           <p className="text-lg font-medium">
//             {data.truckPlate ?? "Atama yok"}
//           </p>
//         </div>

//         <div className="border rounded-lg p-4">
//           <p className="text-sm text-gray-500">Durum</p>
//           <p className="text-lg font-medium">{data.status}</p>
//         </div>

//         <div className="border rounded-lg p-4">
//           <p className="text-sm text-gray-500">Toplam Teslimat</p>
//           <p className="text-lg font-medium">{data.totalDeliveries}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/http";

type MeResponse = {
  driverName: string;
  truckPlate: string | null;
  truckStatus: string | null;
};

export default function DriverDashboardPage() {
  const router = useRouter();

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
          setError("Teslimat listesi çekilemedi (endpoint 404/hatali olabilir).");
        }
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
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>

      {error && (
        <div className="border border-red-200 bg-red-50 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Atanmış Kamyon" value={me?.truckPlate ? "Var" : "Yok"} />
        <Card title="Kamyon Plakası" value={me?.truckPlate ?? "-"} />
        <Card title="Durum" value={me?.truckStatus ?? "-"} />
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

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="border rounded-2xl p-5 bg-white">
      <div className="text-sm text-gray-500 mb-1">{title}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
