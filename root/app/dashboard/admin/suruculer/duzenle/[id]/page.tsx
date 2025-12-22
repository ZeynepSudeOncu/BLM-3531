"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Route } from "next";

type Truck = {
  id: string;
  plate: string;
};

type Driver = {
  id: string;
  truckId?: string | null;
};

export default function SurucuKamyonAta() {
  const params = useParams();
  const driverId = params?.id as string;
  const router = useRouter();

  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [truckId, setTruckId] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    Promise.all([
      axios.get(`http://localhost:5144/api/drivers/${driverId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get("http://localhost:5144/api/trucks", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(([driverRes, trucksRes]) => {
        const driver: Driver = driverRes.data;
        setTruckId(driver.truckId ?? "");
        setTrucks(trucksRes.data);
      })
      .catch((err) => {
        console.error("Veriler alınamadı:", err);
      });
  }, [driverId]);

  const handleAssign = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:5144/api/drivers/${driverId}/assign-truck`,
        {
          truckId: truckId || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Kamyon ataması güncellendi");
      router.push("/dashboard/admin/suruculer" as Route);
    } catch (err) {
      console.error("Kamyon atama hatası:", err);
      alert("İşlem başarısız");
    }
  };

  return (
    <div className="p-6 space-y-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold">Sürücüye Kamyon Ata</h1>

      <div>
        <label className="font-medium">Atanacak Kamyon</label>
        <select
          value={truckId}
          onChange={(e) => setTruckId(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="">Kamyonu kaldır</option>
          {trucks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.plate}
            </option>
          ))}
        </select>
      </div>

      <Button onClick={handleAssign}>Kaydet</Button>
    </div>
  );
}
