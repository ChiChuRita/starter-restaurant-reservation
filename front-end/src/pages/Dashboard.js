import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

import Reservation from "../components/Reservation";
import Table from "../components/Table";

import useQuery from "../utils/useQuery";
import { today, next, previous, formatAsDate } from "../utils/date-time";

import "./Dashboard.css";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  const [date, setDate] = useState(today());
  const query = useQuery();

  // sets the date for the dashboard if date is provided in the query
  useEffect(() => {
    //checks wheter the date query is valid, if not date of today will be used
    try {
      setDate(formatAsDate(query.get("date")));
    } catch {
      setDate(today());
    }
  }, []);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    setTablesError(null);
    listTables({}, abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <button onClick={() => setDate(previous(date))}>Previous</button>
      <button onClick={() => setDate(today())}>Today</button>
      <button onClick={() => setDate(next(date))}>Next</button>
      <div className="reservations-container">
        {reservations.map((resData, index) => (
          <Reservation key={index} reservationData={resData} />
        ))}
      </div>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Tables</h4>
      </div>
      <ErrorAlert error={tablesError} />
      <div className="tables-container">
        {tables.map((tData, index) => (
          <Table key={index} tableData={tData} />
        ))}
      </div>
    </main>
  );
}

export default Dashboard;
