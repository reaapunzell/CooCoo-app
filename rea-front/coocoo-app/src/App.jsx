import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Circles } from "react-loader-spinner";
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
import VerifyOTP from "./pages/VerifyOTP.jsx";
import InitiateGroup from "./components/Group Buying/InitiateGroup.jsx";
import GroupDetails from "./components/Group Buying/GroupDetails.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminSignup from "./pages/AdminSignUp.jsx";
import AdminVerifyEmail from "./pages/AdminVerifyEmail.jsx";
import NotFound from "./pages/404.jsx";
import ProducProductUploading from "./components/Group Buying/ProductUploading.jsx";
import ProductUpload from "./components/Group Buying/ProductUploading.jsx";
import Payment from "./components/Group Buying/Payment.jsx";

function App() {
  const [loading, setLoading] = useState(true); // Add the loading state

  useEffect(() => {
    // Simulate a loading delayfu
    const timer = setTimeout(() => {
      setLoading(false); // After 3 seconds, hide the loading animation
    }, 3000);

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div>
      {/* Show the loading animation while the state is true */}
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Circles color="#90BE6D" height={80} width={80} />
        </div>
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="/signup" element={<SignUp />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/weather" element={<WeatherComponent />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/groupbuying" element={<GroupBuyingOnboarding />} />
            <Route path="/existing-groups" element={<ExistingGroups />} />
            <Route path="/initiate-group" element={<InitiateGroup />} />
            <Route path="/group/:id" element={<GroupDetails />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/joined-groups" element={<JoinedGroups />} />
            <Route path="/group-alert" element={<GroupAlert />} />
            <Route path="/settings/*" element={<Settings />} />
            <Route path="/verify-email" element={<VerifyOTP />} />
            
            <Route path="/admin/signup" element={<AdminSignup />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<ProductUpload />} />           
             <Route path="/admin/verify-email" element={<AdminVerifyEmail />} />
            <Route path="/payment" element={<Payment />} /> 
            {/* 404 Catch-All Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
