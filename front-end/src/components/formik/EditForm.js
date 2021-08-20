import React from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import { updateReservation } from "../../utils/api";
import { reservationSchema } from "../../utils/validation";
import {
  asDateString,
  formatAsDate,
  formatAsTime,
} from "../../utils/date-time";

import InputField from "./InputField";

import "./Form.css";

//this form is created with the third-party libary formik which will handle the error output for the user
//form to edit the reservation (US-08)
const EditForm = ({ reservation }) => {
  let history = useHistory();

  //if the sumbit button is pushed the reservation data gets updated and the user gets redirected to the dashboard
  async function onSubmit(data) {
    try {
      await updateReservation(reservation.reservation_id, data);
      history.push(`/dashboard/?date=${formatAsDate(data.reservation_date)}`);
    } catch (err) {
      console.log(err);
    }
  }

  //if the cancel button is pushed the reservation data gets not updated and the user gets redirected to the dashboard
  function onCancel() {
    try {
      history.push(
        `/dashboard/?date=${formatAsDate(reservation.reservation_date)}`
      );
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
      //automatically connects to yup and validates the input via yup, if yup detects some invalid input it will get outputed to the user
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

export default EditForm;
