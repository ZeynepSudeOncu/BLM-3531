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
  truckPlate?: string | null;
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
    if (!token) {
      setLoading(false);
      return;
    }

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
      })
      .catch((err) => {
        console.error("Sürücüler alınamadı:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const ok = confirm("Bu sürücüyü silmek istediğinize emin misiniz?");
    if (!ok) return;

    try {
      await axios.delete(`http://localhost:5144/api/drivers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDrivers((prev) => prev.filter((d) => d.id !== id));
    } catch (e) {
      console.error(e);
      alert("Silme işlemi başarısız.");
    }
  };

  if (loading) {
    return <div className="p-6">Yükleniyor...</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sürücüler</h1>

        <Link href={"/dashboard/admin/suruculer/yeni" as Route}>
          <Button>+ Yeni Sürücü</Button>
        </Link>
      </div>

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
                <td className="border p-2">{d.status}</td>
                <td className="border p-2">
  {d.truckPlate ? (
    <div className="flex items-center gap-2">
      <span>{d.truckPlate}</span>

      {/* 🔒 Kamyon atanmış badge */}
      <span className="text-xs text-green-600 font-medium">
        (atanmış)
      </span>
    </div>
  ) : (
    <span className="text-gray-500">Atanmamış</span>
  )}
</td>

                <td className="border p-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                  <td className="border p-2 text-center">
  <div className="flex gap-2 justify-center">

    <Link href={`/dashboard/admin/suruculer/duzenle/${d.id}`}>
      <Button size="sm" variant="secondary">Düzenle</Button>
    </Link>

    {!d.truckId && (
      <Link href={`/dashboard/admin/suruculer/kamyon-ata/${d.id}` as Route}>
        <Button size="sm" variant="outline">Kamyon Ata</Button>
      </Link>
    )}

  </div>
</td>

                    <Button size="sm" variant="destructive" onClick={() => handleDelete(d.id)}>
                      Sil
                    </Button>
                  </div>
                </td>
              </tr>
            ))}

            {drivers.length === 0 && (
              <tr>
                <td colSpan={6} className="border p-4 text-center text-gray-500">
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
