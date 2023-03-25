import React from "react";
import '../../landingPage/landingpage.css'

function Cards({ title, subtitle, icon }) {
  return (
    <div className="card-container">
      <div className="card-icon">
        <img src={icon} alt="icon" />
      </div>
      <div className="card-content">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

export default Cards;
