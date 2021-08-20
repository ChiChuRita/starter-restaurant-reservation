import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { getTables, getReservation } from "../utils/api";
import { assignTable } from "../utils/api";
import { asDateString } from "../utils/date-time";

import ErrorAlert from "../layout/ErrorAlert";

import "./Seat.css";

//page for seating a reservation (US-04)
function Seat() {
  const { reservation_id } = useParams();
  const [tables, setTables] = useState([]);
  const [reservation, setReservation] = useState([]);
  const [error, setError] = useState(null);
  const selection = useRef(null);
  const history = useHistory();

  useEffect(loadTables, [reservation_id]);

  //fetches all tables
  function loadTables() {
    const abortController = new AbortController();
    setError(null);
    getTables(abortController.signal).then(setTables).catch(setError);
    getReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setError);
    return () => abortController.abort();
  }

  //if form is submitted the table gets assigned
  async function submit() {
    const abortController = new AbortController();
    try {
      await assignTable(reservation_id, selection.current.value);
      history.push(
        `/dashboard/?date=${asDateString(
          new Date(reservation.reservation_date)
        )}`
      );
    } catch (err) {
      setError(err);
      abortController.abort();
    }
  }

  //if the cancel button is pressed return to the previous page
  function cancel() {
    history.goBack();
  }

  return (
    <main>
      <h1>Assign Table</h1>
      <div className="d-md-flex mb-3">
        <div className="assign-table-form">
          <ErrorAlert error={error} />
          <select name="table_id" ref={selection}>
            {tables.map((table, index) => (
              <option
                key={index}
                name={table.table_id}
                value={table.table_id}
              >{`${table.table_name} - ${table.capacity}`}</option>
            ))}
          </select>
          <button type="submit" onClick={submit}>
            Submit
          </button>
          <button onClick={cancel}>Cancel</button>
        </div>
      </div>
    </main>
  );
}

export default Seat;
