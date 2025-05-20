import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Onboarding.css";
import Navigation from "../Navigation";
import Groups, { fakeGroups } from "./Groups";

const ExistingGroups = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const isGuest = localStorage.getItem("isGuest") === "true";

  useEffect(() => {


    if (!token && !isGuest) {
      setError("User not authenticated. Please log in.");
      return;
    }

    if (isGuest) {

      setGroups(fakeGroups);
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
  }, [isGuest, token]);

  const handleSelectGroup = (groupId) => {
    setSelectedGroupId(groupId);
  };

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


     const selectedGroup = groups.find((g) => g.id === selectedGroupId);

   if (isGuest) {
 
  localStorage.setItem('guestGroup', JSON.stringify(selectedGroup));
  navigate(`/group/${selectedGroup.id}`);
  return;

    } else {
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

        navigate(`/group/${selectedGroupId}`);
      } catch (error) {
        console.error("Join group error:", error);
        setError(error.message);
      }
    }
  };

  return (
    <div className="app-container">
      <Navigation />
      <div className="existing-groups-container">
        <div className="header">
          <span>Select your Group Order Option</span>
        </div>

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


        {error && <p className="error-message">{error}</p>}


        <div id="groups-wrapper">
          {groups.length === 0 ? (
            <p>No group orders available.</p>
          ) : (
            groups.map((group) => (
              <div key={group.id} style={{ cursor: "pointer" }}>
                <Groups
                  group={group}
                  selectedGroupId={selectedGroupId}
                  onSelect={handleSelectGroup}
                />
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
