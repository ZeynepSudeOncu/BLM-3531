"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";

interface Order {
  id: string;
  storeId: string;
  depotId: string;
  truckId: string;
  driverId: string;
  status: string;
  date: string;
}

interface Store {
  id: string;
  name: string;
}

interface Depot {
  id: string;
  name: string;
}

interface Truck {
  id: string;
  plate: string;
}

export default function AdminSiparisListesi() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [depots, setDepots] = useState<Depot[]>([]);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [o, s, d, t] = await Promise.all([
          axios.get("http://localhost:5144/api/orders"),
          axios.get("http://localhost:5144/api/stores"),
          axios.get("http://localhost:5144/api/depots"),
          axios.get("http://localhost:5144/api/trucks"),
        ]);
        setOrders(o.data);
        setStores(s.data);
        setDepots(d.data);
        setTrucks(t.data);
      } catch (err) {
        console.error("Veriler alınamadı:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const getStoreName = (id: string) => stores.find((s) => s.id === id)?.name || "-";
  const getDepotName = (id: string) => depots.find((d) => d.id === id)?.name || "-";
  const getTruckPlate = (id: string) => trucks.find((t) => t.id === id)?.plate || "-";

  const handleApprove = async (id: string) => {
    if (!confirm("Bu siparişi onaylamak istiyor musunuz?")) return;
    await axios.put(`http://localhost:5144/api/orders/${id}/approve`);
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "Onaylandı" } : o))
    );
  };

  const handleReject = async (id: string) => {
    if (!confirm("Bu siparişi reddetmek istiyor musunuz?")) return;
    await axios.put(`http://localhost:5144/api/orders/${id}/reject`);
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "Reddedildi" } : o))
    );
  };

  if (loading) return <p className="p-6">Yükleniyor...</p>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Tüm Siparişler</h1>
        <Button onClick={() => (window.location.href = "/dashboard/admin/siparisler/yeni")}>
          + Yeni Sipariş Ekle
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Depo</TableHead>
            <TableHead>Mağaza</TableHead>
            <TableHead>Kamyon</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Tarih</TableHead>
            <TableHead>İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
            <td colSpan={7} className="text-center py-6 text-gray-500">
              Henüz sipariş bulunmuyor.
            </td>
          </TableRow>
          
          ) : (
            orders.map((order, index) => (
              <TableRow key={order.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{getDepotName(order.depotId)}</TableCell>
                <TableCell>{getStoreName(order.storeId)}</TableCell>
                <TableCell>{getTruckPlate(order.truckId)}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      order.status === "Onaylandı"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Reddedildi"
                        ? "bg-red-100 text-red-700"
                        : order.status === "Beklemede"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString("tr-TR")}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        alert(`Sipariş Detayları:\nDepo: ${getDepotName(
                          order.depotId
                        )}\nMağaza: ${getStoreName(order.storeId)}\nKamyon: ${getTruckPlate(
                          order.truckId
                        )}\nDurum: ${order.status}`)
                      }
                    >
                      Detaylar
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleApprove(order.id)}
                      disabled={order.status === "Onaylandı"}
                    >
                      Onayla
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(order.id)}
                      disabled={order.status === "Reddedildi"}
                    >
                      Reddet
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
