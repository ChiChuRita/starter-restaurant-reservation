import React from "react";
import { cancelReservation } from "../utils/api";
import "./Reservation.css";

//component which renders one specific reservation with the data fetched from the api
function Reservation({ reservationData }) {
  const {
    reservation_id,
    first_name,
    last_name,
    people,
    reservation_time,
    status,
  } = reservationData;

  function getName() {
    return `${first_name} ${last_name}`;
  }

  function onCancel() {
    if (!window.confirm("cancel the reservation")) return;
    cancelReservation(reservation_id);
    window.location.reload();
  }

  return (
    <div className="reservation">
      <h1>Reservation</h1>
      <div className="data-container">
        <div className="label">
          <p>Name:</p>
          <p>Time:</p>
          <p>People:</p>
        </div>
        <div className="data">
          <p>{getName()}</p>
          <p>{reservation_time}</p>
          <p>{people}</p>
        </div>
      </div>
      <div className="button-container">
        {status === "booked" && (
          <a href={`/reservations/${reservation_id}/seat`}>Seat</a>
        )}
        {status === "booked" && (
          <a href={`/reservations/${reservation_id}/edit`}>Edit</a>
        )}
        {status === "booked" && (
          <button
            data-reservation-id-cancel={reservation_id}
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
        <p>ID: {reservation_id}</p>
        <p data-reservation-id-status={reservation_id}>{status}</p>
      </div>
    </div>
  );
}

export default Reservation;
