import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./Settings.css";

function SettingsNav() {
  return (
    <div className="settings-navbar">
      <Nav>
        <Nav.Link href="/settings">Account</Nav.Link>
        <Nav.Link href="/settings/changepassword">Change Password</Nav.Link>
        <Nav.Link href="/settings/deleteaccount">Delete Account</Nav.Link>
      </Nav>
    </div>
  );
}

export default SettingsNav;
