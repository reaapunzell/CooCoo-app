import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignUp.css";
import logo from "/public/CooCoo Main logo.svg";

const VerifiedEmail = () => {
  const navigate = useNavigate();

  const loginNav = () => {
    navigate("/");
  };
  return (
    <div className="verified-container">
      <img src={logo} alt="" />
      <h2>Email verified</h2>
      <button className="signup-btn" type="button" onClick={loginNav}>
        Login
      </button>
    </div>
  );
};

export default VerifiedEmail;
