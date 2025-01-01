import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp.jsx";
import WeatherComponent from "./components/Weather.jsx";
import Navigation from "./components/Navigation.jsx";
import GroupBuyingOnboarding from "./components/Group Buying/Onboarding.jsx";
import ExistingGroups from "./components/Group Buying/ExistingGroups.jsx";
import Calendar from "./components/Calendar/Calendar.jsx";
import JoinedGroups from "./components/Group Buying/JoinedGroup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import GroupAlert from "./components/Group Buying/GroupAlert.jsx";
import Settings from "./pages/Settings.jsx"; 
import VerifiedEmail from "./pages/VerfiedEmai.jsx"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/weather" element={<WeatherComponent />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/groupbuying" element={<GroupBuyingOnboarding />} />
        <Route path="/existing-groups" element={<ExistingGroups />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/joined-groups" element={<JoinedGroups />} />
        <Route path="/group-alert" element={<GroupAlert />} />
        <Route path="/settings/*" element={<Settings />} />
        <Route path="/verify-email" element={<VerifiedEmail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
