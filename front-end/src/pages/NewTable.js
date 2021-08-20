import NewTableForm from "../components/formik/NewTableForm";

//page for creating a new table (US-04)
function NewTable() {
  return (
    <main>
      <h1>New Table</h1>
      <div className="d-md-flex mb-3">
        <NewTableForm />
      </div>
    </main>
  );
}

export default NewTable;
