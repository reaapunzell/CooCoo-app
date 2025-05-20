import React from "react";
import { useNavigate } from "react-router-dom";
import "../Navigation.css";

const LogoutButton = () => {
  const navigate = useNavigate();
  const isGuest = localStorage.getItem("isGuest");

  const handleLogOut = () => {
    if (isGuest) {
      localStorage.removeItem("guestGroup");
      localStorage.removeItem("isGuest");

      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("contributed-")) {
          localStorage.removeItem(key);
        }
      });
    }
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
