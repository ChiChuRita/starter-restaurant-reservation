import { deleteAssignment } from "../utils/api";
import { useHistory } from "react-router";
import "./Table.css";

function Table({ tableData }) {
  let history = useHistory();

  async function onFinish() {
    if (!window.confirm("Is this table ready to seat new guests?")) return;
    await deleteAssignment(tableData.table_id);
    history.go(0);
  }

  return (
    <div className="table">
      <div className="table-data">
        <h1>Table {tableData.table_name}</h1>
        <p>Capacity: {tableData.capacity}</p>
      </div>
      <div className="availability">
        <div>
          {!tableData.reservation_id ? (
            <p data-table-id-status={tableData.table_id}>free</p>
          ) : (
            <p data-table-id-status={tableData.table_id}>occupied</p>
          )}
        </div>
        <div className={!tableData.reservation_id ? "free" : "occupied"}></div>
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
