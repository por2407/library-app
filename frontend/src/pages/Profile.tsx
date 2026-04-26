import { useState } from "react";
import { useAuthStore } from "../stores/auth-store";
import TopNavBar from "../components/TopNavBar";
import ModalEditProfile from "../components/ModalEditProfile";

export default function Profile() {
  const { user } = useAuthStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavBar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">โปรไฟล์ของฉัน</h1>
            <p className="mt-2 text-lg text-gray-600">จัดการข้อมูลส่วนตัวและการตั้งค่าบัญชีของคุณ</p>
          </header>

          {user ? (
            <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100 transition-all hover:shadow-2xl">
              <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              <div className="px-8 pb-10">
                <div className="relative -mt-16 flex justify-center">
                  <div className="p-1 bg-white rounded-full shadow-lg">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=128`}
                      alt={user.name}
                      className="w-32 h-32 rounded-full border-4 border-white object-cover"
                    />
                  </div>
                </div>

                <div className="text-center mt-6">
                  <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-blue-600 font-medium px-3 py-1 bg-blue-50 inline-block rounded-full text-sm mt-2 uppercase tracking-wider">
                    {user.role}
                  </p>
                </div>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto border-t border-gray-100 pt-10">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">ชื่อ-นามสกุล</p>
                    <p className="text-lg font-medium text-gray-800">{user.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">อีเมล</p>
                    <p className="text-lg font-medium text-gray-800">{user.email}</p>
                  </div>
                </div>

                <div className="mt-12 flex justify-center">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-lg shadow-gray-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    แก้ไขโปรไฟล์
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl shadow-lg text-center border border-dashed border-gray-300">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-xl font-medium text-gray-500">ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบอีกครั้ง</p>
            </div>
          )}
        </div>
      </div>

      {user && (
        <ModalEditProfile
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={user}
        />
      )}
    </div>
  );
}

