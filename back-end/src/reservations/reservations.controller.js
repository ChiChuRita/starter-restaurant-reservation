const { today } = require("../utils/date-time");
const { reservationSchema, numberSchema } = require("../utils/validation");
const yup = require("yup");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const {
  getReservations,
  getReservationsByNumber,
  insertReservation,
  getReservation,
  updateStatus,
  updateReservation,
} = require("./reservations.service");

//API endpoint for the "/dashboard" route with date query (part of user story 1)
async function list(req, res) {
  if (req.query.mobile_number) {
    await numberSchema.validate(req.query.mobile_number);
    res.json({ data: await getReservationsByNumber(req.query.mobile_number) });
  } else {
    //validates the date query if no date is supplied it will return the reservations of today
    const dateQuery = (await yup.date().validate(req.query.date)) || today();
    res.json({ data: await getReservations(dateQuery) });
  }
}

async function listByID(req, res, next) {
  const { reservation_id } = req.params;
  await yup.number().validate(reservation_id);

  let reservation = await getReservation(reservation_id);
  if (!reservation)
    return next({
      message: `No reservation found with reservation_id = ${reservation_id}`,
      status: 404,
    });
  res.json({ data: reservation });
}

//user story 1 inserts a new reservation into the database)
async function createNewOrder(req, res) {
  //backend validation of new reservation
  await reservationSchema.validate(req.body.data);

  await insertReservation(req.body.data);

  res.status(201).json({ data: req.body.data });
}

async function update(req, res, next) {
  const { reservation_id } = req.params;

  await reservationSchema.validate(req.body.data);
  await yup.number().validate(reservation_id);

  if (!(await getReservation(reservation_id)))
    return next({
      message: `No reservation found with reservation_id = ${reservation_id}`,
      status: 404,
    });

  await updateReservation({ reservation_id, ...req.body.data });

  res.json({ data: req.body.data });
}

async function setStatus(req, res, next) {
  const { reservation_id } = req.params;
  const { status } = req.body.data;

  await yup.number().validate(reservation_id);
  await yup
    .string()
    .matches(
      /booked|seated|finished|cancelled/,
      ({ value }) => `invalid status: ${value}`
    )
    .validate(status);

  let reservation = await getReservation(reservation_id);

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

  await updateStatus(reservation_id, status);
  res.json({ data: { status } });
}

module.exports = {
  list: asyncErrorBoundary(list, 400),
  listByID: asyncErrorBoundary(listByID, 400),
  createNewOrder: asyncErrorBoundary(createNewOrder, 400),
  setStatus: asyncErrorBoundary(setStatus, 400),
  update: asyncErrorBoundary(update, 400),
};
