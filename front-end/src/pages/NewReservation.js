import "../components/formik/Form.css";
import NewReservationForm from "../components/formik/NewReservationForm";

function NewReservation() {
  return (
    <main>
      <h1>New Reservation</h1>
      <div className="d-md-flex mb-3">
        <NewReservationForm />
      </div>
    </main>
  );
}

export default NewReservation;
