"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/http";

type Product = {
  id: string;
  name: string;
  code: string;
};

export default function StoreCreateRequestPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState<string>("");
  const [qty, setQty] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const loadProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
      if ((res.data?.length ?? 0) > 0) setProductId(res.data[0].id);
    } catch (e: any) {
      alert(e?.response?.data ?? "Ürünler alınamadı");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const submit = async () => {
    try {
      if (!productId) {
        alert("Ürün seç.");
        return;
      }
      if (!qty || qty <= 0) {
        alert("Miktar 0'dan büyük olmalı.");
        return;
      }

      setLoading(true);
      await api.post("/store-requests", {
        productId,              // GUID gidiyor
        requestedQuantity: qty,
      });

      alert("Talep oluşturuldu");
      setQty(1);
    } catch (e: any) {
      alert(e?.response?.data ?? "Talep oluşturulamadı");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Talep Oluştur</h1>

      <div className="bg-white rounded shadow p-6 max-w-xl space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Ürün</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.code})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Miktar</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={qty}
            min={1}
            onChange={(e) => setQty(Number(e.target.value))}
          />
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded py-2"
        >
          {loading ? "Gönderiliyor..." : "Talep Oluştur"}
        </button>
      </div>
    </div>
  );
}
