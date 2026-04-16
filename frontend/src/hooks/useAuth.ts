import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/auth-store";
import { authApi } from "../api/auth-api";

export const useAuth = () => {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // ถ้ามี user ใน store แล้ว ไม่ต้องเรียก me อีก
        if (user) {
          setLoading(false);
          return;
        }

        // ถ้าไม่มี user แต่มี token ใน cookie ให้เรียก me
        const userData = await authApi.me();
        setUser(userData);
      } catch (error) {
        // ถ้า me ล้มเหลว แสดงว่าไม่ได้ login หรือ token หมดอายุ
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [user, setUser]);

  return { user, loading };
};
