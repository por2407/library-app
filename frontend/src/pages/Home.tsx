import TopNavBar from "../components/TopNavBar";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <>
        <TopNavBar />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">กำลังโหลด...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopNavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          ยินดีต้อนรับสู่ Library App
        </h1>

        {user ? (
          <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">ข้อมูลผู้ใช้</h2>
            <p><strong>ชื่อ:</strong> {user.name}</p>
            <p><strong>อีเมล:</strong> {user.email}</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-4">กรุณาเข้าสู่ระบบเพื่อใช้งาน</p>
            <a
              href="/login"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              เข้าสู่ระบบ
            </a>
          </div>
        )}
      </div>
    </>
  );
}