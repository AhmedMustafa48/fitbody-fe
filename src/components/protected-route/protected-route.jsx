import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@app/auth-context/auth-context";
import AppLoader from "@components/app-loader/app-loader";

const ProtectedRoute = () => {
  const { admin, isLoading } = useAuth();

  if (isLoading) return <AppLoader />;

  return admin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
