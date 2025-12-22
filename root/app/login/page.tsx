'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { login, getProfile, redirectForProfile } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('admin@local');
  const [password, setPassword] = useState('Pass123!');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    try {
      await login({ email, password });

      const profile = await getProfile();
      const redirectPath = redirectForProfile(profile);

      router.push(redirectPath as any);
    } catch (e: any) {
      setErr(e?.response?.data?.error || e?.message || 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid place-items-center min-h-[60vh] p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-4 bg-white p-6 rounded-2xl shadow"
      >
        <h2 className="text-2xl font-semibold text-center">Giriş</h2>

        <div className="space-y-2">
          <label className="block text-sm">E-posta</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            type="email"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm">Parola</label>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            type="password"
            required
          />
        </div>

        {err && <p className="text-sm text-red-600">{err}</p>}

        <button
          disabled={loading}
          className="w-full bg-black text-white rounded-lg py-2 disabled:opacity-50"
        >
          {loading ? 'Gönderiliyor…' : 'Giriş Yap'}
        </button>
      </form>
    </main>
  );
}
