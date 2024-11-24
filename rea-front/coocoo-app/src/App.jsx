import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp.jsx";
import WeatherComponent from './components/Weather.jsx';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/weather" element={<WeatherComponent/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
