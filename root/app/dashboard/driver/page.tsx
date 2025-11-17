'use client';

import { AuthGuard, RoleGuard } from '@/lib/guards';
// import { logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function DriverDashboard() {
  const router = useRouter();

  // const handleLogout = async () => {
  //   await logout();
  //   router.push('/login');
  // };

  return (
    <AuthGuard>
      <RoleGuard allowed={['Driver']}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Sürücü Dashboard</h1>
            {/* <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Çıkış Yap
            </button> */}
          </div>
          <p>Sürücü paneline hoş geldiniz!</p>
        </div>
      </RoleGuard>
    </AuthGuard>
  );
}