import "./Table.css";

function Table({ tableData }) {
  return (
    <div className="table">
      <div className="data">
        <h1>Table {tableData.table_name}</h1>
        <p>Capacity: {tableData.capacity}</p>
      </div>
      <div className="availibility">
        <p data-table-id-status={tableData.table_id}>
          {tableData.free ? "Free" : "Occupied"}
        </p>
      </div>
    </div>
  );
}

export default Table;
