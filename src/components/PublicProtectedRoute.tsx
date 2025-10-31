import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicProtectedRoute() {
  const { user } = useAuth();

  if (user) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
