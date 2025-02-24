import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../Navigation";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("adminToken");

      try {
        const response = await fetch(
          "https://coocoo-app.onrender.com/admin/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      }
    };

    fetchStats();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="app-container">
      <Navigation />
      <div className="admin-dashboard">
        <h2>Admin Dashboard</h2>
        <p>Total Users: {stats.totalUsers || 0}</p>
        <p>Total Orders: {stats.totalOrders || 0}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
