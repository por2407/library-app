import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { authApi } from "../api/auth-api";
import { useRequireGuest } from "../hooks/useRequireGuest";

export default function Register() {
  useRequireGuest();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlerSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน");
      setLoading(false);
      return;
    }

    try {
      await authApi.register(name, email, password);
      navigate("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        alert(
          axiosErr.response?.data?.message ||
            err.message ||
            "เกิดข้อผิดพลาดในการลงทะเบียน"
        );
      } else {
        alert("เกิดข้อผิดพลาดในการลงทะเบียน");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-center">
        ลงทะเบียน เพื่อสร้างบัญชี
      </h1>
      <form
        className="flex flex-col gap-4 w-1/3 mx-auto mt-10"
        onSubmit={handlerSubmit}
      >
        <label className="text-sm font-medium">ชื่อผู้ใช้</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ชื่อผู้ใช้"
          className="border border-gray-300 rounded px-4 py-2"
        />
        <label className="text-sm font-medium">อีเมล</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="อีเมล"
          className="border border-gray-300 rounded px-4 py-2"
        />
        <label className="text-sm font-medium">รหัสผ่าน</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="รหัสผ่าน"
          className="border border-gray-300 rounded px-4 py-2"
        />
        <label className="text-sm font-medium">ยืนยันรหัสผ่าน</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="ยืนยันรหัสผ่าน"
          className="border border-gray-300 rounded px-4 py-2"
        />
        <a href="/login" className="text-sm text-blue-500 hover:underline">
          มีบัญชีแล้ว? เข้าสู่ระบบที่นี่
        </a>
        <button
          disabled={loading}
          type="submit"
          className="bg-blue-500 text-white rounded px-4 py-2"
        >
          ลงทะเบียน
        </button>
      </form>
    </>
  );
}
