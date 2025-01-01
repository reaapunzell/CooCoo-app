import React from "react";
import { Routes, Route } from "react-router-dom";
import AccountForm from "../components/Settings/AccountForm";
import ChangePassword from "../components/Settings/ChangePassword";
import Notifications from "../components/Settings/Notifcations";
import Personalization from "../components/Settings/Personalisation";
import SecurityAndPrivacy from "../components/Settings/SecurityAndPrivacy";
import Navigation from "../components/Navigation";
import SettingsNav from "../components/Settings/SettingsNav";
import "../styles/Settings.css";

const Settings = () => {
  return (
    <div className="app-container">
      <Navigation />
      <div className="settings-container">
        <SettingsNav />
        <div className="settings-content">
          <Routes>
            <Route path="/" element={<AccountForm />} />
            <Route path="changepassword" element={<ChangePassword />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="personalisation" element={<Personalization />} />
            <Route path="securityandprivacy" element={<SecurityAndPrivacy />} />
            <Route path="*" element={<h2>Page Not Found</h2>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Settings;
