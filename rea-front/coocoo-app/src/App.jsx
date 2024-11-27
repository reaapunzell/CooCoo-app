import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp.jsx";
import WeatherComponent from './components/Weather.jsx';
import Navigation from './components/Navigation.jsx';
import GroupBuyingOnboarding from './components/Group Buying/Onboarding.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/weather" element={<WeatherComponent/>} />
        <Route path="/" element={<Navigation/>} />
        <Route path="/groupbuying" element={<GroupBuyingOnboarding/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
