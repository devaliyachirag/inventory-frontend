import { jwtDecode } from "jwt-decode";
import { ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface ProtectedPageProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: ProtectedPageProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else if (location.pathname !== "/login") {
      navigate("/login");
    }
  }, [token, navigate, location.pathname]); 
  useEffect(() => {
    if (!token && location.pathname !== "/login") {
      navigate("/login");
    } else if (location.pathname === "/login" && token) {
      navigate("/");
    }
  }, [token, navigate, location.pathname]);

  if (!token && location.pathname !== "/login") {
    return null;
  }

  if (location.pathname === "/login" && token) {
    return null;
  }

  return <>{children}</>;
};

export default PrivateRoute;

// import { ReactNode, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// interface ProtectedPageProps {
//   children: ReactNode;
// }

// const PrivateRoute = ({ children }: ProtectedPageProps) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   if (
//     (!token && location.pathname !== "/login") ||
//     (token && location.pathname === "/login")
//   ) {
//     return null;
//   }

//   return <>{children}</>;
// };

// export default PrivateRoute;
