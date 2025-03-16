import React from 'react';
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
 const navigate = useNavigate();

 
    const BackToHome = () => {
        navigate("/dashboard");
    };

    return (
        <div className="app-container">
          <div className="display__content">
            <h1> Error 404</h1>
        <h2 className="display__content--info">I have bad news for you</h2>
        <p className="display__content--text">
          The page you are looking for might be removed or is temporarily
          unavailable
        </p>
        <button className="backtohomepage-btn"  type="button" onClick={BackToHome}>Back to homepage</button>
      </div>
        </div>
    );
}

export default NotFound;