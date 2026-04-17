import {create} from "zustand";

export interface User {
    id: number;
    name: string;
    email: string;
}
export const useAuthStore = create<{
    user: User | null;
    setUser: (user: User | null) => void;
    clearUser: () => void;
}>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
}));