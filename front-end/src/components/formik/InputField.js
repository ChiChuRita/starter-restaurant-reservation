import { Field } from "formik";

import "./InputField.css";

const InputField = ({ name, fprops, type, children }) => {
  const { errors, touched } = fprops;
  return (
    <div className="inputfield">
      <label htmlFor={name}>{children}</label>
      <Field type={type} name={name} />
      <p
        className="alert alert-danger"
        style={{
          visibility: !(errors[name] && touched[name]) ? "hidden" : "visible",
        }}
      >
        {errors[name] + ""}
      </p>
    </div>
  );
};

export default InputField;
