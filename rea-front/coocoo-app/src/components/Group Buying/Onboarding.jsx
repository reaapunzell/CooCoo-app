import React from "react";
import { useNavigate } from "react-router-dom";
import "./Onboarding.css";
import Navigation from "../Navigation";

const GroupBuyingOnboarding = () => {
    const navigate = useNavigate();

  const initiateNewGroup = (e) => {
    e.preventDefault();
    navigate("/initiate-group");
  };

  const joinExisitingGroup = (e) => {
    e.preventDefault();
    navigate("/existing-groups");
  };

  return (
    <div className="app-container">
        <Navigation/>
      <div className="onboarding-container">
        <div className="welcome-banner">
          <div className="circle"></div>
          <h1>Welcome to Group Buying</h1>
          <p>
            a new way to make bulk purchasing easier, cheaper, and more
            efficient for farmers!{" "}
          </p>
        </div>
        <div className="description">
          <p>
            {" "}
            This feature allows you to start or join group orders for essential
            supplies like feed, with real-time updates on cost reductions as
            more members participate.
          </p>
        </div>
        <div className="buttons-container">
          <button
            className="initiate-btn"
            type="button"
            onClick={initiateNewGroup}
          >
            {" "}
            Initiate New Group
          </button>
          <button
            className="join-btn"
            type="button"
            onClick={joinExisitingGroup}
          >
            {" "}
            Join Existing Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupBuyingOnboarding;
