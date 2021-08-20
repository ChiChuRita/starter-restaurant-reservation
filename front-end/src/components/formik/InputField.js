import { Field } from "formik";

import "./InputField.css";

//a wrapper of the html-input element. This renders every input element with a label and an error output
const InputField = ({ name, fprops, type, children }) => {
  const { errors, touched } = fprops;
  return (
    <div className="inputfield">
      <label htmlFor={name}>{children}</label>
      <Field type={type} name={name} />
      {/* only displays the error message if the input is invalid*/}
      {errors[name] && touched[name] ? (
        <p className="alert alert-danger">{errors[name]}</p>
      ) : null}
    </div>
  );
};

export default InputField;
