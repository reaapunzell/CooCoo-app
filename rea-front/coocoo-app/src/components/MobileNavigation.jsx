import React, { useState } from "react";
import "./Navigation.css";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "/public/CooCoo Main logo.svg";
import LogoutButton from "./Settings/Logout";

function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="mobile-nav">
    
      <button className="menu-toggle" onClick={toggleMenu}>
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

       
      <nav className={`mobile-nav-links ${isOpen ? "open" : ""}`}>
        <img src={logo} alt="coocoo logo" />
        <Link to="/groupbuying" className="nav-link" onClick={toggleMenu}>
          Group Buying
        </Link>
        <Link to="/settings/" className="nav-link" onClick={toggleMenu}>
          Settings
        </Link>
        <div className="nav-link logout-button-wrapper" onClick={toggleMenu}>
          <LogoutButton />
        </div>
      </nav>
    </div>
  );
}

export default MobileNavigation;
