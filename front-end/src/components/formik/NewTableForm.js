import React from "react";
import { insertNewTable } from "../../utils/api";
import { Formik, Form } from "formik";
import InputField from "./InputField";
import { useHistory } from "react-router";
import { tableSchema } from "../../utils/validation";

function NewTableForm() {
  let history = useHistory();

  async function onSubmit(values) {
    try {
      await insertNewTable(values);
      history.push("/dashboard");
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
        table_name: "",
      }}
      onSubmit={onSubmit}
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
