const service = require("./tables.service");
const { getReservation } = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//third-party validation libary
const yup = require("yup");
const { tableSchema } = require("../utils/validation");

//API-Endpoint for requesting all tables (US-04)
async function getTables(req, res, next) {
  //responses with all tables
  res.json({ data: await service.getTables() });
}

//API-Endpoint for inserting a new table (US-04)
async function insertTable(req, res, next) {
  const { data } = req.body;

  //formal parameter and/or query validation
  await tableSchema.validate(data);

  let table_id = await service.insertTable(data);

  console.log("successfully inserted new table", { table_id, ...data });
  //responses with the inserted table including the assigned table_id
  res.status(201).json({ data: { table_id, ...data } });
}

//API-Endpoint for assigned a table to a reservation (US-04)
async function seat(req, res, next) {
  const { table_id } = req.params;
  const { reservation_id } = req.body.data;

  //formal validation of parameter and body
  await yup.number().validate(table_id);
  await yup.number().validate(reservation_id);

  let reservation = await getReservation(reservation_id);

  //futher validation
  if (!reservation)
    return next({
      message: `No reservation found with reservation_id = ${reservation_id}`,
      status: 404,
    });

  //futher validation
  if (reservation.status == "seated")
    return next({ message: "reservation already seated!", status: 400 });

  let table = await service.checkTable(table_id, reservation);

  //futher validation
  if (!table) {
    return next({
      message: `No valid table! [Either the table is already occupied or has too little capacity]`,
      status: 400,
    });
  }

  await service.seat(table, reservation);
  console.log(
    `succesfully assigned table (${table.table_id}) to reservation (${reservation.reservation_id})`
  );

  //unfortunately the front-end-tests expect a emtpy json response
  res.json({});
}

//API-Endpoint for freeing a table from a reservation (US-05)
async function deleteSeating(req, res, next) {
  const { table_id } = req.params;

  //formal validation of parameter and body
  await yup.number().validate(table_id);

  let table = await service.getTable(table_id);

  //futher validation
  if (!table)
    return next({
      message: `No table with table_id = ${table_id} found!`,
      status: 404,
    });

  //futher validation
  if (!table.reservation_id)
    return next({
      message: `Table not occupied!`,
      status: 400,
    });

  await service.deleteSeating(table);
  console.log(`succesfully removed table assigment`);
  res.sendStatus(200);
}

module.exports = {
  getTables: asyncErrorBoundary(getTables, 400),
  insertTable: asyncErrorBoundary(insertTable, 400),
  seat: asyncErrorBoundary(seat, 400),
  deleteSeating: asyncErrorBoundary(deleteSeating, 400),
};
