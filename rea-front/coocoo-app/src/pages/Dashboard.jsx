import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navigation from "../components/Navigation";
import Calendar from "../components/Calendar/Calendar";
import WeatherComponent from "../components/Weather";
import JoinedGroups from "../components/Group Buying/JoinedGroup";
import "../components/Group Buying/Onboarding.css";
import "./Dashboard.css";
import GroupAlert from "../components/Group Buying/GroupAlert";

const Dashboard = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState({});
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const response = await fetch(
          `http://localhost:8000/dashboard/${username}`,
          {
            method: "GET",
            headers,
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();

        setUser(data.user);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);



  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="app-container">
      <Navigation />
      <div className="dashboard-container">
        <div className="welcome">
          <h2>Welcome back, {user?.username} </h2>
        </div>
        <div className="grid-container">
          <div className="weather-component">
            <WeatherComponent />
          </div>
          <div className="group-alert-component">
            <h2>Alerts</h2>
            <GroupAlert />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
