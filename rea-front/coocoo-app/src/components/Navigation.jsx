import Nav from "react-bootstrap/Nav";
import "./Navigation.css";
import LogoutButton from "./Settings/Logout";
import logo from "/public/CooCoo Main logo.svg";

function Navigation() {
  return (
    <div className="navigation-bar">
      <img src={logo} alt="coocoo logo" />
      <Nav defaultActiveKey="/groupbuying" className="nav-links">
        <Nav.Link href="/groupbuying">Group Buying</Nav.Link>
        <Nav.Link href="/settings/">Settings</Nav.Link>
      </Nav>
      <LogoutButton />
    </div>
  );
}

export default Navigation;
