import { create } from 'zustand';
import { getProfile, logout, UserProfile } from '@/lib/auth';

interface AuthState {
user: UserProfile | null;
loading: boolean;
error?: string;
fetchProfile: () => Promise<void>;
signOut: () => void;
}

export const useAuth = create<AuthState>((set) => ({
user: null,
loading: false,
async fetchProfile() {
set({ loading: true, error: undefined });
try {
const user = await getProfile();
set({ user, loading: false });
} catch (e: any) {
set({ error: e?.message || 'Profil alınamadı', loading: false, user: null });
}
},
signOut() {
logout();
set({ user: null });
}
}));