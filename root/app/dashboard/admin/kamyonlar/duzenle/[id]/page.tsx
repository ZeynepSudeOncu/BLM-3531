"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import type { Route } from "next";

import { Button } from "../../../../../../components/ui/button";
import { Input } from "../../../../../../components/ui/input";
import { Label } from "../../../../../../components/ui/label";

export default function KamyonDuzenle() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [plate, setPlate] = useState("");
  const [model, setModel] = useState("");
  const [capacity, setCapacity] = useState<number>(0);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  // 🔹 mevcut kamyonu çek
  useEffect(() => {
    if (!token || !id) return;

    axios
      .get(`http://localhost:5144/api/Trucks`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const truck = res.data.find((t: any) => t.id === id);
        if (!truck) return;

        setPlate(truck.plate);
        setModel(truck.model);
        setCapacity(truck.capacity);
      });
  }, [id, token]);

  // 🔹 güncelle
  const handleSubmit = async () => {
    if (!token) return;

    try {
      await axios.put(
        `http://localhost:5144/api/Trucks/${id}`,
        { plate, model, capacity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      router.push("/dashboard/admin/kamyonlar" as unknown as Route);
    } catch (err) {
      alert("Güncelleme başarısız");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Kamyon Düzenle</h1>

      <div className="space-y-4">
        <div>
          <Label>Plaka</Label>
          <Input value={plate} onChange={(e) => setPlate(e.target.value)} />
        </div>

        <div>
          <Label>Model</Label>
          <Input value={model} onChange={(e) => setModel(e.target.value)} />
        </div>

        <div>
          <Label>Kapasite</Label>
          <Input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
          />
        </div>

        <Button onClick={handleSubmit} className="w-full">
          Kaydet
        </Button>
      </div>
    </div>
  );
}
