import { useEffect, useState } from "react";
import { getReservations, getTables } from "../utils/api";
import useQuery from "../utils/useQuery";
import { today, next, previous, formatAsDate } from "../utils/date-time";

import ErrorAlert from "../layout/ErrorAlert";
import Reservation from "../components/Reservation";
import Table from "../components/Table";

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

  let query = useQuery();

  useEffect(loadDate, [query]);
  useEffect(loadDashboard, [date]);

  //refreshed the page if date is changed
  function setQuery(date) {
    window.location = `/dashboard/?date=${date}`;
  }

  //sets the date for the dashboard if date is provided in the query
  function loadDate() {
    try {
      setDate(formatAsDate(query.get("date")));
    } catch {
      setDate(today());
    }
  }

  //fetches the reservations and tables from the api
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    getReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    setTablesError(null);
    getTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <div className="button-container">
        <button onClick={() => setQuery(previous(date))}>Previous</button>
        <button onClick={() => setQuery(today())}>Today</button>
        <button onClick={() => setQuery(next(date))}>Next</button>
      </div>
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
