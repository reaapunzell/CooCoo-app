import React from "react";
import AccountForm from "../components/Settings/AccountForm";
import Navigation from "../components/Navigation";
import SettingsNav from "../components/Settings/SettingsNav";


const Settings = () => {
  return (
    <div className="app-container">
      <Navigation />
      <div className="settings-container">
        <SettingsNav />
        <AccountForm />
      </div>
    </div>
  );
};

export default Settings;
