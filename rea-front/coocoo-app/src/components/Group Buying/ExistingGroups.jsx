import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Onboarding.css";
import Navigation from "../Navigation";

const ExistingGroups = () => {
  const navigate = useNavigate();

  // Function to handle joining a group
  const JoinGroup = (e) => {
    e.preventDefault();
    navigate("/joined-groups");
  };

  // Function to select a group (can be updated as needed)
  const SelectGroup = (groupId) => {
    console.log(`Selected group ID: ${groupId}`);
  };

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
    {
      id: 2,
      name: "Cape Town Bulk Feed Group",
      product: "Broiler Starter Feed",
      organizer: "Bob Smith",
      city: "Cape Town",
      target_farmers: 15,
      current_farmers: 10,
      price_per_person: 85.0,
      end_date: "2024-11-15T23:59:59Z",
      status: "open",
    },
    {
      id: 3,
      name: "Durban Farmers Feed Collective",
      product: "Organic Feed",
      organizer: "Clara Davis",
      city: "Durban",
      target_farmers: 12,
      current_farmers: 12,
      price_per_person: 95.0,
      end_date: "2024-10-10T23:59:59Z",
      status: "closed",
    },
    {
      id: 4,
      name: "Pretoria Poultry Coop Buyers",
      product: "Grower Feed",
      organizer: "David Lee",
      city: "Pretoria",
      target_farmers: 12,
      current_farmers: 8,
      price_per_person: 110.0,
      end_date: "2024-12-01T23:59:59Z",
      status: "open",
    },
  ]);

  return (
    <div className="app-container">
      <Navigation />
      <div className="existing-groups-container">
        <div className="header">
          <span>Select your Group Order Option</span>
        </div>
        <div className="user-address-container">
          <span>Address</span>
          <div className="user-address">
            <span>52 Benacre Lane, Johannesburg</span>
            <button>Update Address</button>
          </div>
        </div>
        <div className="groups-selection">
          {groups.map((group) => (
            <div className="group" key={group.id}>
              <span className="group-name">{group.name}</span>
              <div className="group-information">
                <div className="select-btn">
                  <input
                    className="select-btn"
                    type="radio"
                    name="join-group"
                    onClick={() => SelectGroup(group.id)}
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
        <button className="joingroup-btn" type="button" onClick={JoinGroup}>
          Join Group
        </button>
      </div>
    </div>
  );
};

export default ExistingGroups;
