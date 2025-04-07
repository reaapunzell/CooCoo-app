import { Navigate, Outlet } from "react-router-dom";

const AdminRoutes = () => {
  const adminToken = localStorage.getItem("adminToken");
  return adminToken ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default AdminRoutes;
