import Nav from 'react-bootstrap/Nav'
import "./Navigation.css"

function Navigation(){

    return(
        <div className="navigation-bar" >
            <img src="./Coocoo Nav Logo.svg" />
        <Nav defaultActiveKey="/dashboard" className="navigation-bar" >
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            <Nav.Link href="/feedanalysis">Feed Analysis</Nav.Link>
            <Nav.Link href="/weather">Behaviour Analysis</Nav.Link>
            <Nav.Link href="/groupbuying">Group Buying</Nav.Link>
            <Nav.Link href="/settings">Settings</Nav.Link>
        </Nav>
        </div>
    );            
}

export default Navigation