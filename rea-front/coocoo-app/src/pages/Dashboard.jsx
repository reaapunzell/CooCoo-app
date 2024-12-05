import React, {useState} from 'react';
import Navigation from '../components/Navigation';
import Calendar from '../components/Calendar/Calendar';
import WeatherComponent from '../components/Weather';
import JoinedGroups from '../components/Group Buying/JoinedGroup';
import '../components/Group Buying/Onboarding.css';
import './Dashboard.css'
import GroupAlert from '../components/Group Buying/GroupAlert';

const Dashboard=() => {

    //
    const [user] = useState([
        {id: 1,
            username: "Siyabonga",
            city: "Pretoria"
        },
    ]);

    const [tasks, setTasks] = useState({
        '2024-12-01': [
          { id: 1, name: 'Refill feed and water', time: '06:00 AM', completed: false },
          { id: 2, name: 'Refill feed and water', time: '12:00 PM', completed: false },
          { id: 3, name: 'Refill feed and water', time: '16:00 PM', completed: false },
          { id: 4, name: 'Refill feed and water', time: '20:00 PM', completed: false },
        ],
      });

      const [groups] = useState([
        {
          id: 1,
          name: "Johannesburg Poultry Feed Buyers",
          product: "Premium Layer Feed",
          organizer: "Alice Johnson",
          city: "Johannesburg",
          target_farmers: 10,
          current_farmers: 4,
          price_per_person: 120.0,
          end_date: "2024-12-31T23:59:59Z",
          status: "open",
        },
      ]);

    return (
<div className="app-container">
<Navigation />
<div className="dashboard-container">
<div className="welcome"> 
<h2>Welcome back </h2>
</div>
<div className="grid-container">
<div className="weather-component">
    <WeatherComponent/>
</div>
<div className="calendar-component">
    <Calendar/>
</div>
<div className="group-alert-component">
    <h2>Alerts</h2>
    <GroupAlert/>
</div>
</div>
</div>
</div>

    )
}

export default Dashboard