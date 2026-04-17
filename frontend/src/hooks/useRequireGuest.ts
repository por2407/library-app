import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../stores/auth-store";

export const useRequireGuest = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const form = searchParams.get("form") || "/"; // redirect กลับไปหน้าที่ user มาจากหน้า login ถ้าไม่มีให้ไปหน้า home

  useEffect(() => {
    if (user) {
      navigate(form, { replace: true });
    }
  }, [user, navigate, form]);
};