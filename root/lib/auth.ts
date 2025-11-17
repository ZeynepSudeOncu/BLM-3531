import { api } from './http';

export type Role = 'Admin' | 'Depot' | 'Store' | 'Driver';

export interface UserProfile {
  id: string;
  email: string;
  roles: Role[];
}

export async function login({ email, password }: { email: string; password: string }): Promise<string> {
  const res = await api.post('/auth/login', { email, password });
  const token: string = res.data?.token ?? res.data?.accessToken;
  if (!token) throw new Error('Token alınamadı');
  return token;
}

export async function getProfile(): Promise<UserProfile> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token bulunamadı');

  const res = await api.get('/auth/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data ;//as UserProfile;
}


export const roleRoutes: Record<Role, string> = {
  Admin: '/dashboard/admin',
  Depot: '/dashboard/depot',
  Store: '/dashboard/store',
  Driver: '/dashboard/driver',
};

export function redirectForRole(role: string): string {
  const lower = role.toLowerCase();
  return `/dashboard/${lower}`;
}

