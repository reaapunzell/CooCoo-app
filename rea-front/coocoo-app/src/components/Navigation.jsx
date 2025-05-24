import { useState } from "react";
import Nav from "react-bootstrap/Nav";
import "./Navigation.css";
import LogoutButton from "./Settings/Logout";
import logo from "/public/CooCoo Main logo.svg";
import { useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; // for hamburger icon

function Navigation() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="navigation-bar">
      <img src={logo} alt="coocoo logo" className="logo" />
      <div className="hamburger" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>

      <Nav className={`nav-links ${isOpen ? "open" : ""}`}>
        <Nav.Link
          href="/groupbuying"
          className={
            location.pathname === "/groupbuying"
              ? "nav-link active"
              : "nav-link"
          }
          onClick={closeMenu}
        >
          Group Buying
        </Nav.Link>
        <Nav.Link
          href="/settings/"
          className={
            location.pathname === "/settings/" ? "nav-link active" : "nav-link"
          }
          onClick={closeMenu}
        >
          Settings
        </Nav.Link>
        <div className="mobile-logout">
          <LogoutButton />
        </div>
      </Nav>

      <div className="desktop-logout">
        <LogoutButton />
      </div>
    </div>
  );
}

export default Navigation;
