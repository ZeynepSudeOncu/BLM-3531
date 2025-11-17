'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProfile, redirectForRole } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
   
    if (typeof window === 'undefined') return;

    const run = async () => {
      try {
        const me = await getProfile();
        const role = me?.roles?.[0];
        const target = redirectForRole(role);

        if (target && window.location.pathname !== target) {
          router.replace(target as any);
        }
      } catch {
        router.replace('/login');
      }
    };

    run();
  }, [router]);


  return (
    <div className="flex items-center justify-center min-h-screen text-gray-500">
      Yönlendiriliyor...
    </div>
  );
}
