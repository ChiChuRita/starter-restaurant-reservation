import React from "react";
import { Formik, Form } from "formik";
import { updateReservation } from "../../utils/api";
import { reservationSchema } from "../../utils/validation";
import { useHistory } from "react-router-dom";

import InputField from "./InputField";
import { asDateString, formatAsTime } from "../../utils/date-time";

const NewReservationForm = ({ reservation }) => {
  const history = useHistory();

  function onSubmit(data) {
    try {
      updateReservation(reservation.reservation_id, data);
      history.goBack();
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
        first_name: reservation.first_name,
        last_name: reservation.last_name,
        mobile_number: reservation.mobile_number,
        reservation_date: asDateString(new Date(reservation.reservation_date)),
        reservation_time: formatAsTime(reservation.reservation_time),
        people: reservation.people,
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
