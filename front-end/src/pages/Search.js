import { useState, useEffect } from "react";
import SearchForm from "../components/formik/SearchForm";
import { listReservations } from "../utils/api";
import Reservation from "../components/Reservation";
import ErrorAlert from "../layout/ErrorAlert";

import "./Search.css";

function Search() {
  const [query, setQuery] = useState(null);

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadReservations, [query]);

  function loadReservations() {
    if (!query) return;
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ mobile_number: query }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
  }

  return (
    <main>
      <h1>Search</h1>
      <div className="d-md-flex mb-3"></div>
      <ErrorAlert error={reservationsError} />
      {!query && <SearchForm setQuery={setQuery} />}
      <div className="reservations-container">
        {reservations.map((rData, index) => (
          <Reservation key={index} reservationData={rData} search />
        ))}
      </div>
      {query && reservations.length === 0 && <p>No reservations found</p>}
    </main>
  );
}

export default Search;
