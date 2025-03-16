import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import React from 'react';
import "./Dashboard.css";

const AdminDashboard = () => {
  const stats = [
    { title: "Users", value: "1.35m", icon: "👤", change: "-0.1%", color: "bg-purple-200" },
    { title: "Groups", value: "714k", icon: "📦", change: "+2.6%", color: "bg-blue-200" },
    { title: "Purchases", value: "1.72m", icon: "🛒", change: "+2.8%", color: "bg-yellow-200" },
    { title: "Messages", value: "234", icon: "📩", change: "+3.6%", color: "bg-red-200" },
  ];

  const pieData = [
    { name: "America", value: 43.8, color: "#1E3A8A" },
    { name: "Asia", value: 31.3, color: "#F59E0B" },
    { name: "Europe", value: 18.8, color: "#6D28D9" },
    { name: "Africa", value: 6.3, color: "#DC2626" },
  ];

  const barData = [
    { month: "Jan", TeamA: 40, TeamB: 60 },
    { month: "Feb", TeamA: 50, TeamB: 80 },
    { month: "Mar", TeamA: 20, TeamB: 50 },
    { month: "Apr", TeamA: 30, TeamB: 70 },
    { month: "May", TeamA: 60, TeamB: 90 },
    { month: "Jun", TeamA: 45, TeamB: 50 },
    { month: "Jul", TeamA: 30, TeamB: 40 },
    { month: "Aug", TeamA: 70, TeamB: 80 },
    { month: "Sep", TeamA: 55, TeamB: 30 },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Hi, Welcome back 👋</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className={`p-4 rounded-lg shadow-md ${stat.color}`}>
            <div className="flex items-center justify-between">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-sm">{stat.change}</span>
            </div>
            <h2 className="text-lg font-bold mt-2">{stat.title}</h2>
            <p className="text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Current Visits</h2>
          <PieChart width={300} height={250}>
            <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </div>

        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Website Visits (+43%)</h2>
          <BarChart width={400} height={250} data={barData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="TeamA" fill="#1E3A8A" />
            <Bar dataKey="TeamB" fill="#93C5FD" />
          </BarChart>
        </div>
      </div>

      {/* Upload Feed Products */}
      <div className="p-6 bg-white shadow rounded-lg mt-6">
        <h2 className="text-lg font-semibold mb-2">Upload Feed Products</h2>
        <input type="file" className="border p-2 w-full" />
        <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded">Upload</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
