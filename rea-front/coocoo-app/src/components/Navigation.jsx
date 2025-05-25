import Nav from "react-bootstrap/Nav";
import "./Navigation.css";
import LogoutButton from "./Settings/Logout";
import logo from "/public/CooCoo Main logo.svg";
import { Link} from "react-router-dom";
import MobileNavigation from "./MobileNavigation";
import { useLocation } from "react-router-dom";

function Navigation() {
  const location = useLocation();

  return ( <>
    <div className="mobile-nav">
<MobileNavigation />
    </div>
    <div className="navigation-bar">
    
      <img src={logo} alt="coocoo logo" />
      <Nav className="nav-links">
        <Link
          to="/groupbuying"
          className={
            location.pathname === "/groupbuying"
              ? "nav-link active"
              : "nav-link"
          }
        >
          Group Buying
        </Link>
        <Link
          to="/settings"
          className={
            location.pathname === "/settings" ? "nav-link active" : "nav-link"
          }
        >
          Settings
        </Link>
      </Nav>
      <LogoutButton />
    </div>
    </>
  );
}

export default Navigation;