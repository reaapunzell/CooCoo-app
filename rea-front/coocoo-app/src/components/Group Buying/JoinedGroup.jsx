import React from "react";
import { useNavigate } from "react-router-dom";
import "./Onboarding.css";
import Navigation from "../Navigation";


const JoinedGroups = () => {
    return (
      <div className="app-container">
        <Navigation />
        <div className="existing-groups-container">
          <div className="header">
            <span className="user-name" >Rea</span>
            <span>'s Group Purchase </span>
            <span className="participants"> 2/10 </span>
            <span> Farmers have contributed </span>
          </div>
          <div className="expire-date-container">
            <span> This group purchase is going to expire in </span>
            <span className="expire-date"> 7 days</span>
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
          <button className="payyourpart-btn">Pay Your Part</button>
        </div>
      </div>
    );
  };
  
  export default JoinedGroups;
  