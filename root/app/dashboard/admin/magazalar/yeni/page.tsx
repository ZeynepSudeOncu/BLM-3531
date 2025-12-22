"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import type { Route } from "next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Depot = {
  id: string;
  name: string;
};

export default function YeniMagazaEkle() {
  const router = useRouter();

  // 🔹 Form alanları
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isActive, setIsActive] = useState(true);

  // 🔹 Depo seçimi
  const [depots, setDepots] = useState<Depot[]>([]);
  const [depotId, setDepotId] = useState("");

  // 🔹 Sayfa açılınca depoları çek
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5144/api/depots", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setDepots(res.data))
      .catch((err) => {
        console.error("Depolar alınamadı:", err);
        alert("Depolar yüklenemedi");
      });
  }, []);

  // 🔹 Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Frontend zorunlu kontrol
    if (!depotId) {
      alert("Lütfen mağazanın bağlı olduğu depoyu seçin");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5144/api/stores",
        {
          name,
          address,
          phone,
          isActive,
          depotId, // 🔥 CONSTRAINT İLE UYUMLU
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Mağaza başarıyla eklendi!");
      router.push("/dashboard/admin/magazalar" as Route);
    } catch (err: any) {
      console.error("Mağaza ekleme hatası:", err);

      if (err?.response?.status === 400) {
        alert("Geçersiz depo seçimi");
      } else if (err?.response?.status === 401) {
        alert("Yetkisiz işlem");
      } else {
        alert("Mağaza eklenemedi");
      }
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Yeni Mağaza Ekle</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Mağaza adı */}
        <Input
          placeholder="Mağaza Adı"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Adres */}
        <Input
          placeholder="Adres"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        {/* Telefon */}
        <Input
          placeholder="Telefon"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        {/* 🔥 Bağlı Depo */}
        <div>
          <label className="font-medium block mb-1">Bağlı Depo</label>
          <select
            value={depotId}
            onChange={(e) => setDepotId(e.target.value)}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">Depo seçiniz</option>
            {depots.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Aktif / Pasif */}
        <div>
          <label className="font-medium block mb-1">Durum</label>
          <select
            value={isActive ? "1" : "0"}
            onChange={(e) => setIsActive(e.target.value === "1")}
            className="border p-2 rounded w-full"
          >
            <option value="1">Aktif</option>
            <option value="0">Pasif</option>
          </select>
        </div>

        <Button type="submit">Kaydet</Button>
      </form>
    </div>
  );
}
