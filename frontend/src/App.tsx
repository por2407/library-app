import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import DetailBook from "./pages/DetailBook";
import Management from "./pages/admin/management";
import History from "./pages/History";

import { useReservations } from "./hooks/useReservations";
import { useBorrows } from "./hooks/useBorrows";
import HistoryAdmin from "./pages/admin/History";

import { useAuth } from "./hooks/useAuth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/book/:id",
    element: <DetailBook />,
  },
  {
    path: "/admin/management",
    element: <Management />,
  },
  {
    path: "/admin/history",
    element: <HistoryAdmin />,
  },
  {
    path: "/history",
    element: <History />,
  },
]);

function AppContent() {
  const { loading } = useAuth();
  useReservations();
  useBorrows();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">กำลังโหลด...</div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

function App() {
  return <AppContent />;
}

export default App;
