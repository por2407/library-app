import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth-api";
import { useAuthStore } from "../stores/auth-store";


export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    if (!email || !password) {
      setLoading(false);
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      await authApi.login(email, password);
      const user = await authApi.me();
      setUser(user);
      navigate("/");
    } catch (err: unknown) {
      alert(
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
      );
      return;
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <form
        className="flex flex-col gap-4 w-1/3 mx-auto mt-10"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold">เข้าสู่ระบบ</h1>
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
        <a href="/register" className="text-sm text-blue-500 hover:underline">
          ยังไม่มีบัญชี? ลงทะเบียนที่นี่
        </a>
        <button
          disabled={loading}
          type="submit"
          className="bg-blue-500 text-white rounded px-4 py-2"
        >
          เข้าสู่ระบบ
        </button>
      </form>
    </>
  );
}
