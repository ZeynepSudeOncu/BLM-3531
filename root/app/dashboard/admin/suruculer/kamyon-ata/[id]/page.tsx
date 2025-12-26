"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function KamyonAtaPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const token = localStorage.getItem("token");

  const [trucks, setTrucks] = useState<any[]>([]);
  const [selectedTruckId, setSelectedTruckId] = useState("");

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:5144/api/trucks", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setTrucks(res.data));
  }, [token]);

  const handleAssign = async () => {
    if (!token || !selectedTruckId) return;

    await axios.put(
      `http://localhost:5144/api/drivers/${id}/assign-truck`,
      { truckId: selectedTruckId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    router.push("/dashboard/admin/suruculer");
  };

  return (
    <div className="p-6 max-w-xl space-y-4">
      <h1 className="text-xl font-bold">Kamyon Ata</h1>

      <select
        className="border p-2 w-full"
        value={selectedTruckId}
        onChange={e => setSelectedTruckId(e.target.value)}
      >
        <option value="">Kamyon Seç</option>
        {trucks.map(t => (
          <option key={t.id} value={t.id} disabled={t.isAssigned}>
            {t.plate} {t.isAssigned ? "(atanmış)" : ""}
          </option>
        ))}
      </select>

      <Button onClick={handleAssign}>Kaydet</Button>
    </div>
  );
}
