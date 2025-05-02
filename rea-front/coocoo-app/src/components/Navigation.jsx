import Nav from "react-bootstrap/Nav";
import "./Navigation.css";
import LogoutButton from "./Settings/Logout";
import logo from "/public/CooCoo Main logo.svg";
import { useLocation } from "react-router-dom";

function Navigation() {
  const location = useLocation();

  return (
    <div className="navigation-bar">
      <img src={logo} alt="coocoo logo" />
      <Nav className="nav-links">
        <Nav.Link
          href="/groupbuying"
          className={
            location.pathname === "/groupbuying"
              ? "nav-link active"
              : "nav-link"
          }
        >
          Group Buying
        </Nav.Link>
        <Nav.Link
          href="/settings/"
          className={
            location.pathname === "/settings/" ? "nav-link active" : "nav-link"
          }
        >
          Settings
        </Nav.Link>
      </Nav>
      <LogoutButton />
    </div>
  );
}

export default Navigation;
