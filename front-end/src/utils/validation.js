import * as yup from "yup";
import { today, asDateString } from "./date-time";

const timePattern = /^\d\d:\d\d$/;
const mobileNumberPattern = /[+]?[0-9-()]+$/;

//user story 3 time validation checks if the time is not in the past
function timeValidation(value, { parent }) {
  const { reservation_date } = parent;

  //only if the reservation date is for today the time can be in the past
  if (!asDateString(reservation_date) === today()) return true;

  reservation_date.setHours(value.split(":")[0]);
  reservation_date.setMinutes(value.split(":")[1]);
  return new Date() <= reservation_date;
}

//user story 3 time validation
//checks if the time for the reservation is between 10:30 and 21:30 (outside of the time span the resturant is closed)
function checkOpenHours(value) {
  let valueAsDate = new Date(0, 0, 0);
  valueAsDate.setHours(value.split(":")[0]);
  valueAsDate.setMinutes(value.split(":")[1]);

  const min = new Date(0, 0, 0, 10, 30, 0);
  const max = new Date(0, 0, 0, 21, 30, 0);
  return min <= valueAsDate && valueAsDate <= max;
}

//user story 2 date validation
//checks if is it not tuesday (tuesdays the resturant is closed)
function checkOpenDays(value) {
  return value.getDay() != 2;
}

//user story 1 formal validation
export const reservationSchema = yup.object().shape({
  first_name: yup.string().max(256).required("Required"),
  last_name: yup.string().max(256).required("Required"),
  mobile_number: yup
    .string()
    .max(256)
    .matches(mobileNumberPattern, "No valid phone number")
    .required("Required"),
  reservation_date: yup
    .date()
    .min(today(), "Date is in the past")
    .test("openDays", "Resturant is not open", checkOpenDays)
    .required("Required")
    .typeError("Must be a valid date"),
  reservation_time: yup
    .string()
    .max(256)
    .matches(timePattern, "No valid Time")
    .required("Required")
    .test("timeValid", "Time is in the past", timeValidation)
    .test("openHours", "Resturant is not open", checkOpenHours),
  people: yup.number().min(1).required().typeError("Must be a number"),
});

export const tableSchema = yup.object().shape({
  table_name: yup.string().min(2).max(256).required("Required"),
  capacity: yup.number().min(1).required().typeError("Must be a number"),
});
