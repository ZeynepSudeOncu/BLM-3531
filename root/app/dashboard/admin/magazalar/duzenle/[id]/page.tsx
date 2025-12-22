// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import axios from "axios";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// export default function MagazaDuzenlePage() {
//   const router = useRouter();
//   const params = useParams();
//   const id = params?.id as string;

//   const [form, setForm] = useState({
//     name: "",
//     address: "",
//     phone: "",
//     isActive: true
//   });

//   useEffect(() => {
//     axios
//       .get("http://localhost:5144/api/stores")
//       .then((res) => {
//         const target = res.data.find((s: any) => s.id === id);
//         if (target) setForm(target);
//       })
//       .catch((err) => console.error("Mağaza getirme hatası:", err));
//   }, [id]);

//   const handleChange = (e: any) => {
//     const { name, value, type, checked } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value
//     }));
//   };

//   const handleSubmit = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       await axios.put(
//         `http://localhost:5144/api/stores/${id}`,
//         {
//           name: form.name,
//           address: form.address,
//           phone: form.phone,
//           isActive: form.isActive
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       router.push("/dashboard/admin/magazalar");
//     } catch (err) {
//       console.error("Mağaza güncelleme hatası:", err);
//     }
//   };

//   return (
//     <div className="p-6 space-y-4">
//       <h1 className="text-xl font-bold">Mağaza Güncelle</h1>

//       <Input name="name" value={form.name} onChange={handleChange} />
//       <Input name="address" value={form.address} onChange={handleChange} />
//       <Input name="phone" value={form.phone} onChange={handleChange} />

//       <label className="flex items-center gap-2">
//         <input
//           type="checkbox"
//           name="isActive"
//           checked={form.isActive}
//           onChange={handleChange}
//         />
//         Aktif mi?
//       </label>

//       <Button onClick={handleSubmit}>Kaydet</Button>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Depot = {
  id: string;
  name: string;
};

export default function MagazaDuzenlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [depots, setDepots] = useState<Depot[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    isActive: true,
    depotId: ""
  });

  // 🔹 Depoları ve mağazayı yükle
  useEffect(() => {
    const token = localStorage.getItem("token");

    Promise.all([
      axios.get("http://localhost:5144/api/depots", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`http://localhost:5144/api/stores/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(([depotsRes, storeRes]) => {
        setDepots(depotsRes.data);
        setForm({
          name: storeRes.data.name,
          address: storeRes.data.address,
          phone: storeRes.data.phone,
          isActive: storeRes.data.isActive,
          depotId: storeRes.data.depotId,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Mağaza/depo getirme hatası:", err);
        alert("Veriler yüklenemedi");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.depotId) {
      alert("Lütfen bağlı olduğu depoyu seçin");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5144/api/stores/${id}`,
        {
          name: form.name,
          address: form.address,
          phone: form.phone,
          isActive: form.isActive,
          depotId: form.depotId, // 🔥 CONSTRAINT İLE UYUMLU
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Mağaza güncellendi");
      router.push("/dashboard/admin/magazalar");
    } catch (err: any) {
      console.error("Mağaza güncelleme hatası:", err);

      if (err?.response?.status === 400) {
        alert("Geçersiz depo seçimi");
      } else {
        alert("Mağaza güncellenemedi");
      }
    }
  };

  if (loading) {
    return <div className="p-6">Yükleniyor...</div>;
  }

  return (
    <div className="p-6 space-y-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold">Mağaza Güncelle</h1>

      <Input
        name="name"
        placeholder="Mağaza Adı"
        value={form.name}
        onChange={handleChange}
      />

      <Input
        name="address"
        placeholder="Adres"
        value={form.address}
        onChange={handleChange}
      />

      <Input
        name="phone"
        placeholder="Telefon"
        value={form.phone}
        onChange={handleChange}
      />

      {/* 🔥 BAĞLI DEPO */}
      <div>
        <label className="font-medium block mb-1">Bağlı Depo</label>
        <select
          name="depotId"
          value={form.depotId}
          onChange={handleChange}
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
