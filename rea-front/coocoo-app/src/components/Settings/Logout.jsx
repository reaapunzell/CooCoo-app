import React from "react";
import { useNavigate } from "react-router-dom";
import "../Navigation.css";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");

    navigate("/");
  };

  return (
    <button className="logout-btn" onClick={handleLogOut}>
      Log Out
    </button>
  );
};

export default LogoutButton;
