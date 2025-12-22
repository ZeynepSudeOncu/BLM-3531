"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Route } from "next";

type Driver = {
  id: string;
  fullName: string;
  phone: string;
  license: string;
  status: string;
  truckId?: string | null;
};

type Truck = {
  id: string;
  plate: string;
};

export default function SuruculerPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    Promise.all([
      axios.get("http://localhost:5144/api/drivers", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get("http://localhost:5144/api/trucks", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(([driversRes, trucksRes]) => {
        setDrivers(driversRes.data);
        setTrucks(trucksRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Sürücüler alınamadı:", err);
        setLoading(false);
      });
  }, []);

  const getTruckPlate = (truckId?: string | null) => {
    if (!truckId) return "—";
    const truck = trucks.find((t) => t.id === truckId);
    return truck ? truck.plate : "—";
  };

  if (loading) {
    return <div className="p-6">Yükleniyor...</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Sürücüler</h1>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Ad Soyad</th>
              <th className="border p-2 text-left">Telefon</th>
              <th className="border p-2 text-left">Ehliyet</th>
              <th className="border p-2 text-left">Durum</th>
              <th className="border p-2 text-left">Kamyon</th>
              <th className="border p-2 text-center">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((d) => (
              <tr key={d.id}>
                <td className="border p-2">{d.fullName}</td>
                <td className="border p-2">{d.phone}</td>
                <td className="border p-2">{d.license}</td>
                <td className="border p-2">
                  {d.status === "Active" ? "Aktif" : "Pasif"}
                </td>
                <td className="border p-2">
                  {getTruckPlate(d.truckId)}
                </td>
                <td className="border p-2 text-center">
                  <Link
                    href={`/dashboard/admin/suruculer/duzenle/${d.id}` as Route}
                  >
                    <Button size="sm" variant="outline">
                      Kamyon Ata
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}

            {drivers.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="border p-4 text-center text-gray-500"
                >
                  Kayıtlı sürücü yok
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
