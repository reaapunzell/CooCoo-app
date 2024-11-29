import React from "react";
import { useNavigate } from "react-router-dom";
import "./Onboarding.css";
import Navigation from "../Navigation";

const ExistingGroups = () => {
    const navigate = useNavigate();

    const JoinGroup = (e) => {
      e.preventDefault();
      navigate("/joined-groups");
    };

  return (
    <div className="app-container">
      <Navigation />
      <div className="existing-groups-container">
        <div className="header">
          <span> Select your Group Order Option</span>
        </div>
        <div className="groups-selection">
          <div className="group">
            <input type="radio" name="join-group" />
            <span className="number-of-farmers">10</span>
            <span className="feed-name">
              {" "}
              Chicken Feed Mixed Poultry Grain 10kg
            </span>
            <span className="currency">R</span>
            <span className="price"></span>
            <span className="per-person">per person</span>
          </div>
        </div>
        <button className="joingroup-btn" type="button" onClick={JoinGroup}>Join Group</button>
      </div>
    </div>
  );
};

export default ExistingGroups;
