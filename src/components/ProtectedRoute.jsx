import { Navigate } from "react-router-dom";
import { useCheckTokenQuery } from "../redux/api";

const ProtectedRoute = ({ children }) => {

  const token = localStorage.getItem("token");

  // Token nahi hai
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  const { data, isLoading, isError, isSuccess } = useCheckTokenQuery();

  console.log(isSuccess)

  // Loader
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Invalid token
  if (isError || !data?.success) {
    // localStorage.removeItem("token");
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;