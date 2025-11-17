'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProfile } from '@/lib/auth';
import { AuthGuard } from '@/lib/guards';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string>('');
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const me = await getProfile();
        setEmail(me.email); 
      } catch {
        setEmail('');
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (open && !menuRef.current?.contains(e.target as Node) && !btnRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('profile');
    router.replace('/login' as const);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen grid grid-rows-[auto_1fr] bg-gray-50 text-gray-900">
        <header className="border-b bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            {/* Sol: Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold">
                L
              </div>
              <span className="text-lg font-semibold">Lojistik Panel</span>
            </div>

            {/* Sağ: Dropdown */}
            <div className="relative">
              <button
                ref={btnRef}
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 hover:bg-gray-100 px-3 py-1 rounded-md focus:outline-none"
              >
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {email?.charAt(0).toUpperCase() || 'K'}
                </div>
                <span className="text-sm hidden sm:inline">
                  {email || '...'}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ${open ? 'rotate-180' : ''}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.11l3.71-3.88a.75.75 0 111.08 1.04l-4.25 4.45a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {open && (
                <div
                  ref={menuRef}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow z-50 border"
                >
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-semibold">Kullanıcı</p>
                    <p className="text-xs text-gray-500 truncate">{email || '...'}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600"
                  >
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto w-full p-4">{children}</main>
      </div>
    </AuthGuard>
  );
}
