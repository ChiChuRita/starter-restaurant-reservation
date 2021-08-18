const yup = require("yup");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { tableSchema } = require("../utils/validation");

const { getReservation } = require("../reservations/reservations.service");
const {
  getTables,
  insertTable,
  assignReservationToSeat,
  availableSeats,
  deleteSeating,
  getTable,
} = require("./tables.service");

async function list(req, res, next) {
  res.json({ data: await getTables() });
}

async function newTable(req, res, next) {
  await tableSchema.validate(req.body.data);
  await insertTable(req.body.data);
  res.status(201).json({ data: req.body.data });
}

async function assignSeat(req, res, next) {
  const tableID = req.params.table_id;
  const { reservation_id } = req.body.data;

  //formal validation of parameter and body
  await yup.number().validate(tableID);
  await yup.number().validate(reservation_id);

  let reservation = await getReservation(reservation_id);

  if (!reservation)
    return next({
      message: `No reservation found with reservation_id = ${reservation_id}`,
      status: 404,
    });

  if (reservation.status == "seated")
    return next({ message: "reservation already seated!", status: 400 });

  await assignReservationToSeat(tableID, reservation);
  res.sendStatus(200);
}

async function getAvailableTables(req, res, next) {
  //validation
  const { reservation_id } = req.query;
  await yup
    .number()
    .typeError("No valid reservation_id provided")
    .validate(reservation_id);

  let reservation = await getReservation(reservation_id);
  //if no reservation with that id was found
  if (!reservation)
    next({ message: "No reservation with that ID found!", status: 400 });

  res.json({ data: await availableSeats(reservation.people) });
}

async function deleteAssignment(req, res, next) {
  const { table_id } = req.params;

  let table = await getTable(table_id);

  if (!table)
    next({
      message: `No table with table_id = ${table_id} found!`,
      status: 404,
    });

  await deleteSeating(table);
  res.sendStatus(200);
}

module.exports = {
  newTable: asyncErrorBoundary(newTable, 400),
  list: asyncErrorBoundary(list, 400),
  assignSeat: asyncErrorBoundary(assignSeat, 400),
  getAvailableTables: asyncErrorBoundary(getAvailableTables, 400),
  deleteAssignment: asyncErrorBoundary(deleteAssignment, 400),
};
