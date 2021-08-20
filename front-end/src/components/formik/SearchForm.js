import React from "react";
import { Formik, Form } from "formik";
import { searchSchema } from "../../utils/validation";

import InputField from "./InputField";

import "./Form.css";

//search form for finding a reservation via mobile_number (US-07)
function SearchForm({ setQuery }) {
  //if the submit button is pushed all reservations with the mobile_number get fetched and displayed
  function onSubmit(values) {
    try {
      setQuery(values.mobile_number);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Formik
      initialValues={{
        mobile_number: "",
      }}
      onSubmit={onSubmit}
      //automatically connects to yup and validates the input via yup, if yup detects some invalid input it will get outputed to the user
      validationSchema={searchSchema}
    >
      {(fprops) => (
        <Form className="form">
          <InputField name="mobile_number" fprops={fprops}>
            Mobile Number
          </InputField>
          <button type="submit">Find</button>
        </Form>
      )}
    </Formik>
  );
}

export default SearchForm;
