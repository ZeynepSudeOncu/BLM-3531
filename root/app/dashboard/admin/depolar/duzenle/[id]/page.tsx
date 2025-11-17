'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function DepoDuzenlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [form, setForm] = useState({
    name: '',
    address: '',
    capacity: 0,
    isActive: true
  });

  useEffect(() => {
    axios.get(`http://localhost:5144/api/depots`)
      .then(res => {
        const target = res.data.find((d: any) => d.id === id);
        if (target) setForm(target);
      })
      .catch(err => console.error('Depo getirme hatası:', err));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:5144/api/depots/${id}`, {
        name: form.name,
        address: form.address,
        capacity: Number(form.capacity),
        isActive: form.isActive
      });
      router.push('/dashboard/admin/depolar');
    } catch (err) {
      console.error('Güncelleme hatası:', err);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Depo Güncelle</h1>
      <Input
        name="name"
        placeholder="Depo Adı"
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
        name="capacity"
        type="number"
        placeholder="Kapasite"
        value={form.capacity}
        onChange={handleChange}
      />
      <label className="flex items-center gap-2">
        <input
          name="isActive"
          type="checkbox"
          checked={form.isActive}
          onChange={handleChange}
        />
        Aktif mi?
      </label>
      <Button onClick={handleSubmit}>Kaydet</Button>
    </div>
  );
}
