import { useState, useEffect } from "react";
import { getReservations } from "../utils/api";

import SearchForm from "../components/formik/SearchForm";
import Reservation from "../components/Reservation";
import ErrorAlert from "../layout/ErrorAlert";

import "./Search.css";

//page for searching a reservation via the mobile_number (US-07)
function Search() {
  const [query, setQuery] = useState(null);

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadReservations, [query]);

  //fetches the reservations with the mobile_number
  function loadReservations() {
    if (!query) return;
    const abortController = new AbortController();
    setReservationsError(null);
    getReservations({ mobile_number: query }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
  }

  return (
    <main>
      <h1>Search</h1>
      <div className="d-md-flex mb-3">
        <ErrorAlert error={reservationsError} />
        {!query && <SearchForm setQuery={setQuery} />}
        <div className="reservations-container">
          {reservations.map((rData, index) => (
            <Reservation key={index} reservationData={rData} search />
          ))}
        </div>
      </div>
      {query && reservations.length === 0 && <p>No reservations found</p>}
    </main>
  );
}

export default Search;
