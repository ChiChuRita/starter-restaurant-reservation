import React from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import { formatAsDate, today } from "../../utils/date-time";
import { insertNewReservation } from "../../utils/api";
import { reservationSchema } from "../../utils/validation";

import InputField from "./InputField";

import "./Form.css";

//this form is created with the third-party libary formik which will handle the error output for the user
//form to create a new reservation (US-01)
const NewReservationForm = () => {
  let history = useHistory();

  //if the submit button is pushed it inserts the new reservation to the database and then the user gets redirected to the dashboard
  async function onSubmit(data) {
    try {
      await insertNewReservation(data);
      history.push(`/dashboard/?date=${formatAsDate(data.reservation_date)}`);
    } catch (err) {
      console.log(err);
    }
  }

  //if the cancel button is pushed the user is redirected to the previous page
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
        reservation_date: today(), //automatically puts the date of today for better user experience
        reservation_time: new Date().toLocaleTimeString().substring(0, 5), //automatically puts the time of now for better user experience
        people: 1,
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

export default NewReservationForm;
