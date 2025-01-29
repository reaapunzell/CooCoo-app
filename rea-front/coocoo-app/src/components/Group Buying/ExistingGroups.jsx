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
    if (!token) {
      setError("User not authenticated. Please log in.");
      return;
    }

    fetch("https://coocoo-app.onrender.com/api/groups/", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // Corrected Authorization header
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
            "Authorization": `Bearer ${token}`,
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

      navigate("/joined-groups");
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

        {error && <p className="error-message">{error}</p>} {/* Show error message */}

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
