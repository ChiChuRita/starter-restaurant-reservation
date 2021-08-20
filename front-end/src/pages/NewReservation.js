import NewReservationForm from "../components/formik/NewReservationForm";

//page for creating a new reservation (US-01)
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
