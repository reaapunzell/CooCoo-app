import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");

    navigate("/");
  };

  return <button onClick={handleLogOut}>Log Out</button>;
};

export default LogoutButton;
