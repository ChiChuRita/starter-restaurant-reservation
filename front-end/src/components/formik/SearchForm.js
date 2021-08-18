import React from "react";
import { Formik, Form } from "formik";
import InputField from "./InputField";
import { searchSchema } from "../../utils/validation";

import "./Form.css";

function NewTableForm({ setQuery }) {
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

export default NewTableForm;
