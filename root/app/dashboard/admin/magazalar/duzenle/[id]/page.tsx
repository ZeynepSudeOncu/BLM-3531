"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function MagazaDuzenlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    isActive: true
  });

  useEffect(() => {
    axios
      .get("http://localhost:5144/api/stores")
      .then((res) => {
        const target = res.data.find((s: any) => s.id === id);
        if (target) setForm(target);
      })
      .catch((err) => console.error("Mağaza getirme hatası:", err));
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5144/api/stores/${id}`,
        {
          name: form.name,
          address: form.address,
          phone: form.phone,
          isActive: form.isActive
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      router.push("/dashboard/admin/magazalar");
    } catch (err) {
      console.error("Mağaza güncelleme hatası:", err);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Mağaza Güncelle</h1>

      <Input name="name" value={form.name} onChange={handleChange} />
      <Input name="address" value={form.address} onChange={handleChange} />
      <Input name="phone" value={form.phone} onChange={handleChange} />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isActive"
          checked={form.isActive}
          onChange={handleChange}
        />
        Aktif mi?
      </label>

      <Button onClick={handleSubmit}>Kaydet</Button>
    </div>
  );
}
