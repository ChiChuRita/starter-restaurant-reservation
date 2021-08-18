const knex = require("../db/connection");

//gets the reservation entries of the specific date and orders them by time
async function getReservations(date) {
  return await knex("reservations")
    .where("reservation_date", date)
    .andWhereNot("status", "finished")
    .orderBy("reservation_time");
}

async function getReservationsByNumber(number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

//inserts a new reservation to the database
async function insertReservation(reservation) {
  return await knex("reservations").insert(reservation);
}

async function updateReservation(reservation) {
  await knex("reservations")
    .update({ ...reservation })
    .where("reservation_id", reservation.reservation_id);
}

async function getReservation(reservationID) {
  return await knex("reservations")
    .where("reservation_id", reservationID)
    .first();
}

async function updateStatus(reservationID, status) {
  await knex("reservations")
    .update("status", status)
    .where("reservation_id", reservationID);
}

module.exports = {
  getReservations,
  getReservationsByNumber,
  insertReservation,
  getReservation,
  updateStatus,
  updateReservation,
};
