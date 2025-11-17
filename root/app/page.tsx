import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Hoş Geldiniz</h1>
      <p className="mb-4">Bu sistem bir lojistik dağıtım platformudur.</p>
      <Link 
        href="/login" 
        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors inline-block"
      >
        Giriş Yap
      </Link>
    </main>
  );
}