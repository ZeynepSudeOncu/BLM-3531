export type Role = 'Admin' | 'Depot' | 'Store' | 'Driver';

export const roleRoutes: Record<Role, string> = {
  Admin: '/dashboard/admin',
  Depot: '/dashboard/depot',
  Store: '/dashboard/store',
  Driver: '/dashboard/driver',
};

export function redirectForRole(role: Role | string): string {
  const normalizedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  return roleRoutes[normalizedRole as Role] || '/dashboard';
}