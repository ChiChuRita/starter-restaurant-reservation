import { deleteAssignment } from "../utils/api";
import { useHistory } from "react-router";

import "./Table.css";

//component which renders a table with the data fetched from the api
function Table({ tableData }) {
  let history = useHistory();

  //if the finish button is pushed the the assignment of the table gets removed
  async function onFinish() {
    if (!window.confirm("Is this table ready to seat new guests?")) return;
    try {
      await deleteAssignment(tableData.table_id);
      history.go(0);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="table">
      <div className="table-data">
        <h1>Table {tableData.table_name}</h1>
        <p>Capacity: {tableData.capacity}</p>
        <div className="availability">
          <div
            className={
              !tableData.reservation_id ? "status free" : "status occupied"
            }
          ></div>
          <div>
            {!tableData.reservation_id ? (
              <p data-table-id-status={tableData.table_id}>free</p>
            ) : (
              <p data-table-id-status={tableData.table_id}>occupied</p>
            )}
          </div>
        </div>
      </div>
      <div className="button-container">
        {tableData.reservation_id && (
          <button data-table-id-finish={tableData.table_id} onClick={onFinish}>
            Finished
          </button>
        )}
      </div>
    </div>
  );
}

export default Table;
