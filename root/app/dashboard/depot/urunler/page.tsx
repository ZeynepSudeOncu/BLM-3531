"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Search } from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
}

export default function DepotUrunler() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [userDepotId, setUserDepotId] = useState<string>("");

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("profile") || "{}");
    setUserDepotId(profile.depotId);
  }, []);
  
  const toplamStok = products.reduce((sum, p) => sum + p.stock, 0);
  const dusukStok = products.filter((p) => p.stock < p.minStock).length;

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    axios
      .get("http://localhost:5144/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Ürünler alınamadı:", err));
  }, []);
  

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Depo Ürünleri</h1>

      {/* Kartlar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg shadow bg-white flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Toplam Ürün</p>
            <p className="text-2xl font-bold">{products.length}</p>
          </div>
          <span className="text-3xl">📦</span>
        </div>
        <div className="p-4 rounded-lg shadow bg-white flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Düşük Stok</p>
            <p className="text-2xl font-bold text-orange-600">{dusukStok}</p>
          </div>
          <span className="text-3xl">⚠️</span>
        </div>
        <div className="p-4 rounded-lg shadow bg-white flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Toplam Stok</p>
            <p className="text-2xl font-bold text-green-600">{toplamStok}</p>
          </div>
          <span className="text-3xl">📊</span>
        </div>
      </div>

      {/* Arama ve Yeni Ürün */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-1/2">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Ürün adı, SKU veya kategori ile ara..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => (window.location.href = "/dashboard/depot/urunler/yeni")}>
          + Yeni Ürün
        </Button>
      </div>

      {/* Ürün Listesi */}
      <div className="bg-white rounded-lg shadow divide-y">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Ürün bulunamadı.</div>
        ) : (
          filteredProducts.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
            >
              <div>
                <p className="font-semibold text-lg">{p.name}</p>
                <p className="text-sm text-gray-500">
                  SKU: {p.sku} • {p.category}
                </p>
                <p
                  className={`text-sm font-medium mt-1 ${
                    p.stock < p.minStock
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  Stok: {p.stock} Adet • Min: {p.minStock}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => alert(`${p.name} stoğu güncellenecek.`)}
                >
                  Stok Güncelle
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => alert(`${p.name} düzenlenecek.`)}
                >
                  ✏️
                </Button>
                <Button
                  variant="destructive"
                  onClick={() =>
                    confirm(`${p.name} silinsin mi?`) &&
                    setProducts((prev) => prev.filter((x) => x.id !== p.id))
                  }
                >
                  🗑️
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
