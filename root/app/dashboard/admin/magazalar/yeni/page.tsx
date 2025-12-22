"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import type { Route } from "next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function YeniMagazaEkle() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5144/api/stores",
        {
          name,
          address,
          phone,
          isActive
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      alert("Mağaza başarıyla eklendi!");
      router.push("/dashboard/admin/magazalar" as Route);
    } catch (err) {
      console.error("Mağaza ekleme hatası:", err);
      alert("Mağaza eklenemedi!");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Yeni Mağaza Ekle</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          placeholder="Mağaza Adı"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          placeholder="Adres"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <Input
          placeholder="Telefon"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <select
          value={isActive ? "1" : "0"}
          onChange={(e) => setIsActive(e.target.value === "1")}
          className="border p-2 rounded w-full"
        >
          <option value="1">Aktif</option>
          <option value="0">Pasif</option>
        </select>

        <Button type="submit">Kaydet</Button>
      </form>
    </div>
  );
}
