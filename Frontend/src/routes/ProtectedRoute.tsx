import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  children: React.ReactNode;
  allowedRoles?: string[];
};

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 🔄 still checking auth
  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  // ❌ not logged in → go login + remember where user was
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ❌ role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // ✅ allowed
  return <>{children}</>;
};

export default ProtectedRoute;