import { useAuth } from "@/hooks/use-auth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const { accessToken, authLoading } = useAuth();
  const location = useLocation();
  if (authLoading) return null;
  if (!accessToken)
    return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
