import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { listTables, getReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import { assignTable } from "../utils/api";
import { asDateString } from "../utils/date-time";

function Seat() {
  const { reservation_id } = useParams();
  const [tables, setTables] = useState([]);
  const [reservation, setReservation] = useState([]);
  const [error, setError] = useState(null);
  const selection = useRef(null);
  const history = useHistory();

  function loadTables() {
    const abortController = new AbortController();
    setError(null);
    listTables(abortController.signal).then(setTables).catch(setError);
    getReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setError);
    return () => abortController.abort();
  }

  useEffect(loadTables, [reservation_id]);

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

  function cancel() {
    history.goBack();
  }

  return (
    <main>
      <h1>Assign Table</h1>
      <div className="d-md-flex mb-3">
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
    </main>
  );
}

export default Seat;
