import {create} from "zustand";
import { persist } from "zustand/middleware";

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface AuthState {
    user: User | null;
    isLogin: boolean;
    setUser: (user: User | null) => void;
    clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isLogin: false, 
            setUser: (user) => set({ user, isLogin: true }),
            clearUser: () => set({ user: null, isLogin: false }),
        }),
        {
            name: "auth-storage", // ชื่อ key ที่จะถูกเก็บใน localStorage
            partialize: (state) => ({ isLogin: state.isLogin }), // เลือกจำแค่ isLogin ตลอดไป
        }
    )
);