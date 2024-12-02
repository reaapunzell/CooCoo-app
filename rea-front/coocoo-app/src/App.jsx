import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp.jsx";
import WeatherComponent from './components/Weather.jsx';
import Navigation from './components/Navigation.jsx';
import GroupBuyingOnboarding from './components/Group Buying/Onboarding.jsx';
import ExistingGroups from './components/Group Buying/ExistingGroups.jsx';
<<<<<<< HEAD
import JoinedGroups from './components/Group Buying/JoinedGroup.jsx';


=======
import Calendar from './components/Calendar/Calendar.jsx';
>>>>>>> ae247f03c120e7878c44513e367a704299f8d61c

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/weather" element={<WeatherComponent/>} />
        <Route path="/" element={<Navigation/>} />
        <Route path="/groupbuying" element={<GroupBuyingOnboarding/>} />
        <Route path="/existing-groups" element={<ExistingGroups/>} />
<<<<<<< HEAD
        <Route path="/joined-groups" element={<JoinedGroups/>} />
=======
        <Route path="/calendar" element={<Calendar/>} />
>>>>>>> ae247f03c120e7878c44513e367a704299f8d61c
      </Routes>
    </BrowserRouter>
  );
}

export default App;
