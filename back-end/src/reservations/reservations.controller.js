const { today } = require("../utils/date-time");
const { reservationSchema } = require("../utils/validation");

const yup = require("yup");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const {
  getReservations,
  insertReservation,
} = require("./reservations.service");

//API endpoint for the "/dashboard" route with date query (part of user story 1)
async function list(req, res) {
  //validates the date query if no date is supplied it will return the reservations of today
  const dateQuery = (await yup.date().validate(req.query.date)) || today();
  res.json(await getReservations(dateQuery));
}

//user story 1 inserts a new reservation into the database)
async function createNewOrder(req, res) {
  //backend validation of new reservation
  await reservationSchema.validate(req.body);

  await insertReservation(req.body);
  res.sendStatus(200);
}

module.exports = {
  list: asyncErrorBoundary(list, 400),
  createNewOrder: asyncErrorBoundary(createNewOrder, 400),
};
