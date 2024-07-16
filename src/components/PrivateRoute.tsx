import { ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface ProtectedPageProps {
  children: ReactNode;
}
const PrivateRoute = ({ children }: ProtectedPageProps) => {
  const location = useLocation();

  const router = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token && location.pathname !== "/login") {
      router("/login");
    } else if (location.pathname === "/login" && token) {
      router("/");
    }
  }, [token, router, location.pathname]);
  if (
    (!token && location.pathname !== "/login") ||
    (location.pathname === "/login" && token)
  ) {
    return null;
  }
  return <>{children}</>;
};
export default PrivateRoute;
