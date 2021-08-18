import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { listAvailableTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import { assignTable } from "../utils/api";

function Seat() {
  const { reservation_id } = useParams();
  const [availableSeats, setAvailableSeats] = useState([]);
  const [error, setError] = useState(null);
  const selection = useRef(null);
  const history = useHistory();

  function loadAvailableSeats() {
    const abortController = new AbortController();
    setError(null);
    listAvailableTables({ reservation_id }, abortController.signal)
      .then(setAvailableSeats)
      .catch(setError);
  }

  useEffect(loadAvailableSeats, [reservation_id]);

  function submit() {
    assignTable(reservation_id, selection.current.value);
    history.push("/dashboard");
    window.location.reload();
  }

  function cancel() {
    history.goBack();
  }

  if (!error)
    return (
      <main>
        <h1>Assign Table</h1>
        <div className="d-md-flex mb-3">
          <ErrorAlert error={error} />
          <select name="tabe" ref={selection}>
            {availableSeats.map((table, index) => (
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
  return (
    <div>
      <ErrorAlert error={error} />
      <h2>No available tables found!</h2>
    </div>
  );
}

export default Seat;
