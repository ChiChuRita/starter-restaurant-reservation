import React from "react";
import { useHistory } from "react-router";
import { Formik, Form } from "formik";
import { insertNewTable } from "../../utils/api";
import { tableSchema } from "../../utils/validation";

import InputField from "./InputField";

import "./Form.css";

//this form is created with the third-party libary formik which will handle the error output for the user
//form to create a new table (US-04)
function NewTableForm() {
  let history = useHistory();

  //if the submit button is pushed the new table gets inserted to the database
  async function onSubmit(values) {
    try {
      await insertNewTable(values);
      history.push("/dashboard");
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
        table_name: "",
      }}
      onSubmit={onSubmit}
      //automatically connects to yup and validates the input via yup, if yup detects some invalid input it will get outputed to the user
      validationSchema={tableSchema}
    >
      {(fprops) => (
        <Form className="form">
          <InputField name="table_name" fprops={fprops}>
            Name
          </InputField>
          <InputField name="capacity" fprops={fprops}>
            Capacity
          </InputField>
          <button type="submit">Submit</button>
          <button onClick={onCancel}>Cancel</button>
        </Form>
      )}
    </Formik>
  );
}

export default NewTableForm;
