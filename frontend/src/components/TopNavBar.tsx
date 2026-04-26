import { useAuthStore } from "../stores/auth-store";
import { authApi } from "../api/auth-api";
import { useNavigate } from "react-router-dom";
export default function TopNavBar() {
  const { user, clearUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      clearUser();
      navigate("/login");
    } catch (err: unknown) {
      alert(
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "เกิดข้อผิดพลาดในการออกจากระบบ",
      );
    }
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-white text-lg font-bold">Library App</div>
        <div>
          <a
            href="/"
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Home
          </a>
          {user ? (
            <>
              {user.role.toLowerCase() === "admin" ? (
                <>
                  <a
                    href="/admin/management"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    การจัดการหนังสือ
                  </a>
                  <a
                    href="/admin/history"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    ประวัติการยืม
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="/history"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    ประวัติการยืม
                  </a>
                  <a
                    href="/profile"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {user.name}
                  </a>
                </>
              )}
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <a
              href="/login"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Login
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
