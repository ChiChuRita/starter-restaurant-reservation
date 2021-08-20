const knex = require("../db/connection");

//gets the reservation entries of the specific date and orders them by time (US-01)
async function getReservations(date) {
  return await knex("reservations")
    .where("reservation_date", date)
    .andWhereNot("status", "finished")
    .orderBy("reservation_time");
}

//gets the reservation entries with the mobile_number and orders them by time (US-07)
//code from https://github.com/Thinkful-Ed/starter-restaurant-reservation
async function getReservationsByNumber(number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

//inserts a new reservation to the database and returns the assigned reservation_id (US-01)
async function insertReservation(reservation) {
  return (
    await knex("reservations").insert(reservation).returning("reservation_id")
  )[0];
}

//updates the reservation with the edited data (US-08)
async function updateReservation(reservation) {
  await knex("reservations")
    .update({ ...reservation })
    .where("reservation_id", reservation.reservation_id);
}

//returns the reservation data of a reservation (US-04)
async function getReservation(reservationID) {
  return await knex("reservations")
    .where("reservation_id", reservationID)
    .first();
}

//updates the status of a reservation
async function updateReservationStatus(reservationID, status) {
  await knex("reservations")
    .update("status", status)
    .where("reservation_id", reservationID);
}

module.exports = {
  getReservations,
  getReservationsByNumber,
  insertReservation,
  getReservation,
  updateReservationStatus,
  updateReservation,
};
