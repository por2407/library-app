import { useAuthStore } from "../stores/auth-store";
import TopNavBar from "../components/TopNavBar";

export default function Profile() {
    const { user } = useAuthStore();
  return (
    <>
      <TopNavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4 text-center">โปรไฟล์ของฉัน</h1>
        {user ? (
          <div className="bg-white shadow-md rounded-lg p-6 max-w-md text-center mx-auto">
            <h2 className="text-xl font-semibold mb-4">ข้อมูลผู้ใช้</h2>
            <p><strong>ชื่อ:</strong> {user.name}</p>
            <p><strong>อีเมล:</strong> {user.email}</p>
          </div>
        ) : (
          <p>ไม่พบข้อมูลผู้ใช้</p>
        )}
      </div>
    </>
  );
}