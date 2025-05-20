import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Onboarding.css";
import Navigation from "../Navigation";
import Group from "./Group";

const ExistingGroups = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]); // Groups state (default to empty array)
  const [selectedGroupId, setSelectedGroupId] = useState(null); // Track selected group
  const [error, setError] = useState(""); // Error state
  const token = localStorage.getItem("token"); // Retrieve token

  useEffect(() => {
    const isGuest = localStorage.getItem("isGuest") === "true";

    if (!token && !isGuest) {
      setError("User not authenticated. Please log in.");
      return;
    }

    if (isGuest) {
      // Guest demo groups
      const guestGroups = [
        {
          id: 1,
          name: "Starter Poultry Group",
          created_by: { username: "guest_leader1" },
          expires_in_days: 5,
          brand: "Coocoo Feed Lite",
          price_per_user: 120,
          city: { name: "Cape Town", province: "Western Cape" },
        },
        {
          id: 2,
          name: "Egg Boosters Club",
          created_by: { username: "guest_leader2" },
          expires_in_days: 3,
          brand: "Golden Eggs Feed",
          price_per_user: 150,
          city: { name: "Durban", province: "KwaZulu-Natal" },
        },
        {
          id: 3,
          name: "Broiler Bundle Team",
          created_by: { username: "guest_leader3" },
          expires_in_days: 7,
          brand: "SuperGrow Feed",
          price_per_user: 100,
          city: { name: "Pretoria", province: "Gauteng" },
        },
      ];
      setGroups(guestGroups);
      return;
    }

    fetch("https://coocoo-app.onrender.com/api/groups/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch groups.");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched groups:", data);
        setGroups(data);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
      });
  }, [token]);

  // Function to handle selecting a group
  const handleSelectGroup = (groupId) => {
    setSelectedGroupId(groupId);
  };

  // Function to handle joining a group
  const JoinGroup = async (e) => {
    e.preventDefault();

    if (isGuest) {
      alert("Demo: You’ve joined the group successfully!");
      return;
    }

    if (!selectedGroupId) {
      setError("Please select a group before joining.");
      return;
    }

    try {
      const response = await fetch(
        `https://coocoo-app.onrender.com/api/groups/${selectedGroupId}/join`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: 0,
            amount_contributed: 0,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to join group");
      }

      navigate(`/group/${group.id}`);
    } catch (error) {
      console.error("Join group error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="app-container">
      <Navigation />
      <div className="existing-groups-container">
        <div className="header">
          <span>Select your Group Order Option</span>
        </div>
        {/* Dynamically Load User Address if Available */}
        {groups.length > 0 && groups[0].city ? (
          <div className="user-address-container">
            <span>Address</span>
            <div className="user-address">
              <span>
                {groups[0].city.name}, {groups[0].city.province}
              </span>
              <button>Update Address</button>
            </div>
          </div>
        ) : (
          <p>Loading address...</p>
        )}
        {error && <p className="error-message">{error}</p>}{" "}
        {/* Show error message */}
        <div id="groups-wrapper">
          {groups.length === 0 ? (
            <p>No group orders available.</p>
          ) : (
            groups.map((group) => (
              <div key={group.id} onClick={() => handleSelectGroup(group.id)}>
                <Group group={group} />
                <button
                  className={`select-group-btn ${
                    selectedGroupId === group.id ? "selected" : ""
                  }`}
                >
                  {selectedGroupId === group.id ? "Selected" : "Select Group"}
                </button>
              </div>
            ))
          )}
        </div>
        <button className="joingroup-btn" type="button" onClick={JoinGroup}>
          Join Group
        </button>
      </div>
    </div>
  );
};

export default ExistingGroups;
