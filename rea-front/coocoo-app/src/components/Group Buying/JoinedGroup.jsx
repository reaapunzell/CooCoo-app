import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Onboarding.css";
import Navigation from "../Navigation";

const JoinedGroups = () => {
  // Group data
  const [groups] = useState([
    {
      id: 1,
      name: "Johannesburg Poultry Feed Buyers",
      product: "Premium Layer Feed",
      organizer: "Alice Johnson",
      city: "Johannesburg",
      target_farmers: 10,
      current_farmers: 4,
      price_per_person: 120.0,
      end_date: "2024-12-31T23:59:59Z",
      status: "open",
    },
  ]);

  //calculate days left until expiration of group purchase
  const calculateDaysLeft = (endDate) => {
    const diff = new Date(endDate) -  new Date();
    return Math.ceil(diff / (1000 *60 *60 *24));
  };

  return (
    <div className="app-container">
      <Navigation />
      <div className="existing-groups-container">
        <div className="header">
          {groups.map((group) => (
            <div key={group.id}>
              <span className="user-name">{group.organizer}</span>
              <span>'s Group Purchase </span> <br></br>
              <span className="participants">
                {" "}
                {group.current_farmers}/{group.target_farmers}{" "}
              </span>
              <span> Farmers have contributed </span>
            </div>
          ))}
        </div>
        <div className="expire-date-container">
          {groups.map((group)=>(
            <div key={group.id}>
<span> This group purchase is going to expire in </span>
<span className="expire-date">{calculateDaysLeft(group.end_date)} days</span>
            </div>
          ))}
          
        </div>
        <div className="groups-selection">
          {groups.map((group) => (
            <div className="group" key={group.id}>
              <span className="group-name">{group.name}</span>
              <div className="group-information">
                <div className="selected-btn">
                  <input
                    className="selected-btn"
                    type="radio"
                    name="join-group"
                  />
                </div>
                <div className="progress">
                  <span>Progress</span>
                  <span className="number-of-farmers">
                    {group.current_farmers}/{group.target_farmers} farmers
                  </span>
                </div>
                <div className="product">
                  <span>Product</span>
                  <span className="feed-name">{group.product}</span>
                </div>
                <div className="price">
                  <span className="price">
                    R{group.price_per_person.toFixed(2)}
                  </span>
                  <span className="per-person">per person</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="payyourpart-btn">Pay Your Part</button>
      </div>
    </div>
  );
};

export default JoinedGroups;
