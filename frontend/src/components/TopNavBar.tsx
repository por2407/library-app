import { useAuthStore } from "../stores/auth-store";
export default function TopNavBar() {
  const { user } = useAuthStore();

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
              <a
                href="/profile"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                {user.name}
              </a>
              <a
                href="/logout"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </a>
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
