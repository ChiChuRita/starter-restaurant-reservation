import { useState, useEffect } from "react";
import { useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { getReservation } from "../utils/api";
import EditForm from "../components/formik/EditForm";

export default function EditReservation() {
  const { reservation_id } = useParams();
  const [reservation, setReservation] = useState();
  const [reservationError, setReservationError] = useState(null);

  useEffect(loadReservation, [reservation_id]);

  function loadReservation() {
    const abortController = new AbortController();
    setReservationError(null);
    getReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setReservationError);
  }

  return (
    <main>
      <h1>Search</h1>
      <div className="d-md-flex mb-3"></div>
      <ErrorAlert error={reservationError} />
      {reservation && <EditForm reservation={reservation} />}
      {JSON.stringify(reservation)}
    </main>
  );
}
