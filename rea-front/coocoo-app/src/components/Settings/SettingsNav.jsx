
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import './Settings.css';

function NavScrollExample() {
  return (
    <div className="settings-navbar">
        <Nav defaultActiveKey="/settings/account" className="">
        <Nav.Link href="/settings/account">Dashboard</Nav.Link>
            <Nav.Link href="/settings/changepassword">Group Buying</Nav.Link>
            <Nav.Link href="/settings/notifications">Notifications</Nav.Link>
            <Nav.Link href="/settings/personalisation">Personlisation</Nav.Link>
            <Nav.Link href="/settings/securityandprivacy">Security and Privacy</Nav.Link>
        </Nav>
    </div>
  );
}

export default NavScrollExample;
