import React from "react";
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {

    const handleSubmit = (e) =>{
        e.preventDefault();
        navigate('/initiatenewgroup')
    }


    return(
        <div className="onboarding-container" >
            <h1>Welcome to Group Buying</h1>
            <p>a new way to make bulk purchasing easier, cheaper, and more efficient for farmers! </p>
            <p> This feature allows you to start or join group orders for essential supplies like feed, with real-time updates on cost reductions as more members participate.</p>
        <button className ="onboarding-btn" type="button" onClick={handeSubmit}> Initiate New Group</button>
        <button> Join Group </button>
        </div>
    )
}


export default Onboarding