const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//third-party validation libary
const yup = require("yup");
const { reservationSchema, numberSchema } = require("../utils/validation");

const { today } = require("../utils/date-time");

//API endpoint for requesting all reservations of a specific date or with a number (US-01 and US-07)
async function getReservations(req, res, next) {
  const { mobile_number, date } = req.query;

  //if mobile_number is provided it is a API-endpoint call for searching the reservations (US-07)
  if (mobile_number) {
    //formal parameter and/or query validation
    await numberSchema.validate(mobile_number);

    //responses with all reservations matching the query
    res.json({
      data: await service.getReservationsByNumber(mobile_number),
    });
  } else {
    //validates the date query if no date is supplied it will return the reservations of today
    const dateQuery = (await yup.date().validate(date)) || today();

    //responses with all reservations matching the query
    res.json({ data: await service.getReservations(dateQuery) });
  }
}

//API endpoint for requesting the data for a specific reservation (US-04)
async function getReservation(req, res, next) {
  const { reservation_id } = req.params;

  //formal parameter and/or query validation
  await yup.number().validate(reservation_id);

  let reservation = await service.getReservation(reservation_id);

  //futher validations
  if (!reservation)
    return next({
      message: `No reservation found with reservation_id = ${reservation_id}`,
      status: 404,
    });

  //responses with the reservation data of the requested reservation
  res.json({ data: reservation });
}

//API-Endpoint for inserting a new reservation into the database (US-01)
async function insertReservation(req, res, next) {
  const { data } = req.body;

  //formal parameter and/or query validation
  await reservationSchema.validate(req.body.data);

  let reservation_id = await service.insertReservation(data);

  //responses with the inserted reservation including the assigned reservation_id
  res.status(201).json({ data: { reservation_id, ...data } });
}

//API-Endpoint for updating a reservation (US-08)
async function updateReservation(req, res, next) {
  const { data } = req.body;
  const { reservation_id } = req.params;

  //formal parameter and/or query validation
  await reservationSchema.validate(data);
  await yup.number().validate(reservation_id);

  //futher validations
  if (!(await service.getReservation(reservation_id)))
    return next({
      message: `No reservation found with reservation_id = ${reservation_id}`,
      status: 404,
    });

  await service.updateReservation({ reservation_id, ...data });

  //responses with the updated reservation data
  res.json({ data: data });
}

//API-Endpoint for updating the status of a reservation (US-06)
async function updateReservationStatus(req, res, next) {
  const { reservation_id } = req.params;
  const { status } = req.body.data;

  //formal parameter and/or query validation
  await yup.number().validate(reservation_id);
  await yup
    .string()
    .matches(
      /booked|seated|finished|cancelled/,
      ({ value }) => `invalid status: ${value}`
    )
    .validate(status);

  let reservation = await service.getReservation(reservation_id);

  //futher validations
  if (!reservation)
    return next({
      message: `no reservation found with reservation_id = ${reservation_id}`,
      status: 404,
    });

  if (reservation.status == "finished")
    return next({
      message: "finished reservation cannot be updated!",
      status: 400,
    });

  await service.updateReservationStatus(reservation_id, status);

  //responses with the new given status
  res.json({ data: { status } });
}

module.exports = {
  getReservations: asyncErrorBoundary(getReservations, 400),
  getReservation: asyncErrorBoundary(getReservation, 400),
  insertReservation: asyncErrorBoundary(insertReservation, 400),
  updateReservationStatus: asyncErrorBoundary(updateReservationStatus, 400),
  updateReservation: asyncErrorBoundary(updateReservation, 400),
};
