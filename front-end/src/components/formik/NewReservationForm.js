import React from "react";
import { Formik, Form } from "formik";
import { formatAsDate, today } from "../../utils/date-time";
import { insertNewReservation } from "../../utils/api";
import { reservationSchema } from "../../utils/validation";
import { useHistory } from "react-router-dom";

import InputField from "./InputField";

const NewReservationForm = () => {
  let history = useHistory();

  async function onSubmit(data) {
    try {
      await insertNewReservation(data);
      history.push(`/dashboard/?date=${formatAsDate(data.reservation_date)}`);
    } catch (err) {
      console.log(err);
    }
  }

  function onCancel() {
    try {
      history.goBack();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Formik
      initialValues={{
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: today(),
        reservation_time: new Date().toLocaleTimeString().substring(0, 5),
        people: 1,
      }}
      onSubmit={onSubmit}
      validationSchema={reservationSchema}
    >
      {(fprops) => (
        <Form className="form">
          <InputField name="first_name" fprops={fprops}>
            First Name
          </InputField>
          <InputField name="last_name" fprops={fprops}>
            Last Name
          </InputField>
          <InputField name="mobile_number" fprops={fprops}>
            Mobile Number
          </InputField>
          <InputField type="date" name="reservation_date" fprops={fprops}>
            Reservation Date
          </InputField>
          <InputField type="time" name="reservation_time" fprops={fprops}>
            Reservation Time
          </InputField>
          <InputField type="number" name="people" fprops={fprops}>
            People
          </InputField>
          <button type="submit">Submit</button>
          <button onClick={onCancel}>Cancel</button>
        </Form>
      )}
    </Formik>
  );
};

export default NewReservationForm;
