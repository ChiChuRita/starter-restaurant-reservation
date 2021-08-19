import React from "react";
import { cancelReservation } from "../utils/api";
import "./Reservation.css";
import { useHistory } from "react-router";

//component which renders one specific reservation with the data fetched from the api
function Reservation({ reservationData, search }) {
  const {
    reservation_id,
    first_name,
    last_name,
    mobile_number,
    people,
    reservation_date,
    reservation_time,
    status,
  } = reservationData;

  let history = useHistory();

  function getName() {
    return `${first_name} ${last_name}`;
  }

  async function onCancel() {
    if (!window.confirm("Do you want to cancel this reservation?")) return;
    await cancelReservation(reservation_id);
    history.go(0);
  }

  return (
    <div className="reservation">
      <h1>Reservation (ID: {reservation_id})</h1>
      <div className="main-container">
        <div className="label-container">
          <p>Name:</p>
          {search && <p>Date:</p>}
          <p>Time:</p>
          <p>People:</p>
          <p>Mobile Number:</p>
          <p>Status:</p>
        </div>
        <div className="data-container">
          <p>{getName()}</p>
          {search && <p>{reservation_date}</p>}
          <p>{reservation_time}</p>
          <p>{people}</p>
          <p>{mobile_number}</p>
          <p data-reservation-id-status={reservation_id}>{status}</p>
        </div>
      </div>
      {status === "booked" && (
        <div className="button-container">
          <a href={`/reservations/${reservation_id}/seat`}>Seat</a>
          <a href={`/reservations/${reservation_id}/edit`}>Edit</a>
          <button
            data-reservation-id-cancel={reservation_id}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default Reservation;
