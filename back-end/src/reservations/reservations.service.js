const knex = require("../db/connection");

//gets the reservation entries of the specific date and orders them by time
async function getReservations(date) {
  return await knex("reservations")
    .where("reservation_date", date)
    .orderBy("reservation_time");
}

//inserts a new reservation to the database
async function insertReservation(reservation) {
  await knex("reservations").insert(reservation);
}

module.exports = {
  getReservations,
  insertReservation,
};
