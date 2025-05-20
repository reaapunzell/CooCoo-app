import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import React from "react";
import "./Dashboard.css";
import logo from "/public/CooCoo Main logo.svg";
import ProductUpload from "../components/Group Buying/ProductUploading";

const mockStats = {
  total_users: 1350,
  active_users: 850,
  total_groups: 300,
  active_groups: 190,
  completed_groups: 110,
  total_participants: 4500,
};

const chartData = [
  { name: "Active Users", value: mockStats.active_users, color: "#38A169" },
  { name: "Active Groups", value: mockStats.active_groups, color: "#3182CE" },
  {
    name: "Completed Groups",
    value: mockStats.completed_groups,
    color: "#D69E2E",
  },
];

const AdminDashboard = () => {
  return (
    <div className="dashboard-container">
      <img src={logo} alt="coocoo logo" />
      <h1>Admin Dashboard</h1>

      {/* Stats Section */}
      <div className="stats-grid">
        {Object.entries(mockStats).map(([key, value]) => (
          <div key={key} className="stat-box">
            <h2>{key.replace("_", " ")}</h2>
            <p>{value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-box">
          <h2>Activity Overview</h2>
          <PieChart width={300} height={250}>
            <Pie
              data={chartData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </div>

        <div className="chart-box">
          <h2>Growth Trends</h2>
          <BarChart width={400} height={250} data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#90be6d" />
          </BarChart>
        </div>
      </div>
      <ProductUpload />
    </div>
  );
};

export default AdminDashboard;
