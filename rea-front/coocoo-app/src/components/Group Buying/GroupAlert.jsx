import React, {useState} from "react";
import "./Onboarding.css"

const GroupAlert = () => {

      // Group data
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

  return(
    <div className="group-alert-container">
        {groups.map((group)=> (
            <div key={group.id}>
                 <span className="group-alert-participants">
        {" "}
        {group.current_farmers}/{group.target_farmers}{" "}
        </span>
        <span className="alert-notification" >Someone has contributed to your group purchase</span>
        </div>
        ))}
       
    </div>
  )
}

export default GroupAlert