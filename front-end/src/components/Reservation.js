import React from "react";
import "./Reservation.css";

//component which renders one specific reservation with the data fetched from the api
function Reservation({ reservationData }) {
  const {
    reservation_id,
    first_name,
    last_name,
    people,
    reservation_date,
    reservation_time,
    updated_at,
    created_at,
  } = reservationData;

  function getName() {
    return `${first_name} ${last_name}`;
  }

  return (
    <div className="reservation">
      <h1>Reservation</h1>
      <div className="data-container">
        <div className="data">
          <p>Name:</p>
          <p>Time:</p>
          <p>People:</p>
        </div>
        <div className="data">
          <p>{getName()}</p>
          <p>{reservation_time}</p>
          <p>{people}</p>
        </div>
        <div className="data id-column">
          <p>ID: {reservation_id}</p>
        </div>
      </div>
    </div>
  );
}

export default Reservation;
