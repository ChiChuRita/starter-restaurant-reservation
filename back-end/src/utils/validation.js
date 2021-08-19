const yup = require("yup");
const { today, asDateString } = require("./date-time");

const timePattern = /^\d\d:\d\d$/;
const mobileNumberPattern = /[+]?[0-9-()]+$/;

//user story 3 time validation checks if the time is not in the past
function timeValidation(value, { parent }) {
  const { reservation_date } = parent;

  if (!reservation_date || !value) return false;

  //only if the reservation date is for today the time can be in the past
  if (!asDateString(reservation_date) === today()) return true;

  reservation_date.setHours(value.split(":")[0]);
  reservation_date.setMinutes(value.split(":")[1]);
  reservation_date.setSeconds(59);
  return new Date() <= reservation_date;
}

//user story 3 time validation
//checks if the time for the reservation is between 10:30 and 21:30 (outside of the time span the resturant is closed)
function checkOpenHours(value) {
  if (!value) return false;

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
  return value && value.getDay() != 2;
}

//user story 1 formal validation
const reservationSchema = yup.object().shape({
  first_name: yup.string().max(256).required(),
  last_name: yup.string().max(256).required(),
  mobile_number: yup.string().max(256).matches(mobileNumberPattern).required(),
  reservation_date: yup
    .date()
    .min(today())
    .required()
    .test(
      "openDays",
      "invalid reservation_date and reservation_time, resturant is closed!",
      checkOpenDays
    ),
  reservation_time: yup
    .string()
    .max(256)
    .matches(timePattern)
    .required()
    .test(
      "timeValid",
      "invalid reservation_date and reservation_time (set time to future)",
      timeValidation
    )
    .test(
      "openHours",
      "invalid reservation_date and reservation_time, resturant is closed!",
      checkOpenHours
    ),
  people: yup.number().min(1).required().strict(),
  status: yup
    .string()
    .matches(/(booked)/, ({ value }) => `invalid status: ${value}`),
});

const tableSchema = yup.object().shape({
  table_name: yup.string().min(2).max(256).required(),
  capacity: yup.number().min(1).required(),
});

const numberSchema = yup
  .string()
  .max(256)
  .matches(mobileNumberPattern)
  .required();

module.exports = {
  reservationSchema,
  tableSchema,
  numberSchema,
};