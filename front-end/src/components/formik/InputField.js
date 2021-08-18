import { Field } from "formik";

import "./InputField.css";

const InputField = ({ name, fprops, type, children }) => {
  const { errors, touched } = fprops;
  return (
    <div className="inputfield">
      <label htmlFor={name}>{children}</label>
      <Field type={type} name={name} />
      {errors[name] && touched[name] ? (
        <p className="alert alert-danger">{errors[name]}</p>
      ) : null}
    </div>
  );
};

export default InputField;
