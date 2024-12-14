import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Onboarding.css";
import Navigation from "../Navigation";
import Group from "./Group";

const ExistingGroups = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([])

  useEffect(()=>{
    setGroups([])

    if (token){
      fetch("http://127.0.0.1:8000/api/groups/", {
        method: "GET",
        header:{
          authorization:token,
        },
      })
      .then((res) => res.json())
      .then((data) => setGroups(data))
      .catch((err) => console.warn("fetch failed"))
    }

  }, [token])

  // Function to handle joining a group
  const JoinGroup = (e) => {
    e.preventDefault();
    navigate("/joined-groups");
  };

  // Function to select a group (can be updated as needed)
  const SelectGroup = (groupId) => {
    console.log(`Selected group ID: ${groupId}`);
  };

  


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
        <div id="groups-wrapper">
        {groups.map((group)=>(
          <Group key={group._id} group={group}/>
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
