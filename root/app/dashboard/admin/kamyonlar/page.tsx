"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import type { Route } from "next";

import { Button } from "../../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";

interface Truck {
  id: string;
  plate: string;
  model: string;
  capacity: number;
  status: string;
}

export default function AdminKamyonListesi() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("http://localhost:5144/api/trucks")
      .then((res) => setTrucks(res.data))
      .catch((err) => console.error("Kamyonlar alınamadı", err));
  }, []);

  const handleAddTruck = () => {
    router.push("/dashboard/admin/kamyonlar/yeni" as unknown as Route);
  };

  const handleDelete = (id: string) => {
    const confirmed = confirm("Bu kamyonu silmek istediğinize emin misiniz?");
    if (!confirmed) return;

    axios
      .delete(`http://localhost:5144/api/trucks/${id}`)
      .then(() => setTrucks((prev) => prev.filter((k) => k.id !== id)))
      .catch((err) => alert("Silme işlemi başarısız: " + err));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Tüm Kamyonlar</h1>
        <Button onClick={handleAddTruck}>+ Yeni Kamyon Ekle</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Plaka</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Kapasite (ton)</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trucks.map((kamyon) => (
            <TableRow key={kamyon.id}>
              <TableCell>{kamyon.id}</TableCell>
              <TableCell>{kamyon.plate}</TableCell>
              <TableCell>{kamyon.model}</TableCell>
              <TableCell>{kamyon.capacity}</TableCell>
              <TableCell>{kamyon.status}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.push(`/dashboard/admin/kamyonlar/${kamyon.id}` as unknown as Route)
                    }
                  >
                    Detay
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      router.push(`/dashboard/admin/kamyonlar/duzenle/${kamyon.id}` as unknown as Route)
                    }
                  >
                    Düzenle
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(kamyon.id)}
                  >
                    Kaldır
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
