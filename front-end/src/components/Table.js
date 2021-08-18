import { deleteAssignment } from "../utils/api";

import "./Table.css";

function Table({ tableData }) {
  function onFinish() {
    window.confirm("Finish reservation!");
    window.location.reload();
    deleteAssignment(tableData.table_id);
  }

  return (
    <div className="table">
      <div className="table-data">
        <h1>Table {tableData.table_name}</h1>
        <p>Capacity: {tableData.capacity}</p>
      </div>
      <div className="availability">
        <div data-table-id-status={tableData.table_id}>
          {tableData.free ? <p>Free</p> : <p>Occupied</p>}
        </div>
        <div className={tableData.free ? "free" : "occupied"}></div>
      </div>
      <div className="button-container">
        {!tableData.free && (
          <button data-table-id-finish={tableData.table_id} onClick={onFinish}>
            Finished
          </button>
        )}
      </div>
    </div>
  );
}

export default Table;
