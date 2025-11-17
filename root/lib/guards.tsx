'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProfile } from '@/lib/auth';
import { Role } from '@/lib/roles';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    (async () => {
      const profile = await getProfile();
      if (!profile) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        router.replace('/login');
        return;
      }
      setOk(true);
    })();
  }, [router]);

  return ok ? <>{children}</> : null;
}

export function RoleGuard({ 
  allowed, 
  children 
}: { 
  allowed: Role[]; 
  children: ReactNode 
}) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const me = await getProfile();
        if (!me) {
          router.replace('/login');
          return;
        }
        
        const roles = me.roles || [];
        const normalizedAllowed = allowed.map(r => r.toLowerCase());
        const has = roles.some(r => normalizedAllowed.includes(r.toLowerCase()));
        
        if (!has) {
          router.replace('/dashboard');
        } else {
          setOk(true);
        }
      } catch {
        router.replace('/login');
      }
    })();
  }, [router, allowed]);

  return ok ? <>{children}</> : null;
}
