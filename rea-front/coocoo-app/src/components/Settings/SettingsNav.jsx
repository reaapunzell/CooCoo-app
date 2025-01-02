
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import './Settings.css';

function SettingsNav() {
  return (
    <div className="settings-navbar">
        <Nav>
        <Nav.Link href="/settings">Account</Nav.Link>
            <Nav.Link href="/settings/changepassword">Change Password</Nav.Link>
            <Nav.Link href="/settings/notifications">Notifications</Nav.Link>
            <Nav.Link href="/settings/personalisation">Personlisation</Nav.Link>
            <Nav.Link href="/settings/securityandprivacy">Security and Privacy</Nav.Link>
        </Nav>
    </div>
  );
}

export default SettingsNav;
