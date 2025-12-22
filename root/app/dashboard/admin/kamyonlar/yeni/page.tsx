"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import type { Route } from "next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function YeniKamyonEkle() {
  const router = useRouter();

  const [plate, setPlate] = useState("");
  const [model, setModel] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [status, setStatus] = useState("Active");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5144/api/trucks",
        {
          plate,
          model,
          capacity,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Kamyon başarıyla eklendi!");
      router.push("/dashboard/admin/kamyonlar" as Route);
    } catch (err: any) {
      console.error("Kamyon ekleme hatası:", err);
      alert("Kamyon eklenemedi!");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Yeni Kamyon Ekle</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="font-medium">Plaka</label>
          <Input
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            placeholder="34 ABC 123"
            required
          />
        </div>

        <div>
          <label className="font-medium">Model</label>
          <Input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Ford Cargo 1833"
            required
          />
        </div>

        <div>
          <label className="font-medium">Kapasite</label>
          <Input
            type="number"
            value={capacity}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setCapacity(isNaN(val) ? 0 : val);
            }}
            placeholder="Kapasite (kg)"
            required
          />
        </div>

        <div>
          <label className="font-medium">Durum</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="Active">Aktif</option>
            <option value="Passive">Pasif</option>
          </select>
        </div>

        <Button type="submit" className="mt-2">
          Kaydet
        </Button>
      </form>
    </div>
  );
}
