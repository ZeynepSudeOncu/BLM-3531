"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function SurucuDuzenlePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const token = localStorage.getItem("token");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [license, setLicense] = useState("");
  const [status, setStatus] = useState("Müsait");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    axios
      .get(`http://localhost:5144/api/drivers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const d = res.data;
        setFullName(d.fullName);
        setPhone(d.phone);
        setLicense(d.license);
        setStatus(d.status);
      })
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleSave = async () => {
    if (!token) return;

    await axios.put(
      `http://localhost:5144/api/drivers/${id}`,
      { fullName, phone, license, status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    router.push("/dashboard/admin/suruculer");
  };

  if (loading) return <div className="p-6">Yükleniyor...</div>;

  return (
    <div className="p-6 max-w-xl space-y-4">
      <h1 className="text-xl font-bold">Sürücü Düzenle</h1>

      <input className="border p-2 w-full" value={fullName} onChange={e => setFullName(e.target.value)} />
      <input className="border p-2 w-full" value={phone} onChange={e => setPhone(e.target.value)} />
      <input className="border p-2 w-full" value={license} onChange={e => setLicense(e.target.value)} />
      <select
            className="border p-2 w-full"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Müsait">Müsait</option>
            <option value="Yolda">Yolda</option>
      </select>

      <Button onClick={handleSave}>Kaydet</Button>
    </div>
  );
}
