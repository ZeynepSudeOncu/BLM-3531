// "use client";

// import { useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import type { Route } from "next";

// import { Button } from "../../../../../components/ui/button";
// import { Input } from "../../../../../components/ui/input";

// export default function YeniDepoEkle() {
//   const router = useRouter();

//   const [Name, setName] = useState("");
//   const [Address, setAddress] = useState("");
//   const [Capacity, setCapacity] = useState(0);
//   const [IsActive, setIsActive] = useState(true);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       await axios.post("http://localhost:5144/api/depots", {
//         name : Name,
//         address: Address,
//         capacity : Capacity,
//         isActive : IsActive,
//       });

//       alert("Depo başarıyla eklendi!");
//       router.push("/dashboard/admin/depolar" as Route);
//     } catch (err: any) {
//         console.log("🚨 Backend Response:", err.response?.data);
//         console.log("🚨 Backend Status:", err.response?.status);
//         console.log("🚨 Backend Headers:", err.response?.headers);
//         alert("Depo eklenemedi!");
//       }
      
//   };

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Yeni Depo Ekle</h1>

//       <form className="space-y-4" onSubmit={handleSubmit}>
//         <div>
//           <label className="font-medium">Depo Adı</label>
//           <Input
//             value={Name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Depo adı..."
//             required
//           />
//         </div>

//         <div>
//           <label className="font-medium">Adres</label>
//           <Input
//             value={Address}
//             onChange={(e) => setAddress(e.target.value)}
//             placeholder="Adres..."
//             required
//           />
//         </div>

//         <div>
//           <label className="font-medium">Kapasite</label>
//           <Input
//             type="number"
//             value={Capacity}
//             onChange={(e) => setCapacity(Number(e.target.value))}
              
//             placeholder="Kapasite..."
//             required
//           />
//         </div>

//         <div>
//           <label className="font-medium">Durum</label>
//           <select
//             value={IsActive ? "1" : "0"}
//             onChange={(e) => setIsActive(e.target.value === "1")}
//             className="border p-2 rounded"
//           >
//             <option value="1">Aktif</option>
//             <option value="0">Pasif</option>
//           </select>
//         </div>

//         <Button type="submit" className="mt-2">
//           Kaydet
//         </Button>
//       </form>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import type { Route } from "next";

import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";

export default function YeniDepoEkle() {
  const router = useRouter();

  const [Name, setName] = useState("");
  const [Address, setAddress] = useState("");
  const [Capacity, setCapacity] = useState(0);
  const [IsActive, setIsActive] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // TOKEN EKLENDİ

      await axios.post(
        "http://localhost:5144/api/depots",
        {
          name: Name,
          address: Address,
          capacity: Capacity,
          isActive: IsActive,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Depo başarıyla eklendi!");
      router.push("/dashboard/admin/depolar" as Route);
    } catch (err: any) {
        console.log("🔥 ERROR OBJECT:", err);
        console.log("🔥 RESPONSE DATA:", err?.response?.data);
        console.log("🔥 RESPONSE TEXT:", await err?.response?.request?.responseText);
      
        alert("Depo eklenemedi!");
      }
      
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Yeni Depo Ekle</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="font-medium">Depo Adı</label>
          <Input
            value={Name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Depo adı..."
            required
          />
        </div>

        <div>
          <label className="font-medium">Adres</label>
          <Input
            value={Address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Adres..."
            required
          />
        </div>

        <div>
          <label className="font-medium">Kapasite</label>
          <Input
            type="number"
            value={Capacity}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setCapacity(isNaN(val) ? 0 : val);
            }}
            placeholder="Kapasite..."
            required
          />
        </div>

        <div>
          <label className="font-medium">Durum</label>
          <select
            value={IsActive ? "1" : "0"}
            onChange={(e) => setIsActive(e.target.value === "1")}
            className="border p-2 rounded"
          >
            <option value="1">Aktif</option>
            <option value="0">Pasif</option>
          </select>
        </div>

        <Button type="submit" className="mt-2">
          Kaydet
        </Button>
      </form>
    </div>
  );
}
