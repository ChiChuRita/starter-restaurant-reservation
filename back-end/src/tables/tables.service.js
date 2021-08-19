const knex = require("../db/connection");
const { updateStatus } = require("../reservations/reservations.service");

async function getTables() {
  return await knex("tables").orderBy("table_name");
}

async function getTable(tableID) {
  return await knex("tables").where("table_id", tableID).first();
}

async function availableSeats(minCapacity) {
  return await knex("tables")
    .where("capacity", ">=", minCapacity)
    .andWhere("reservation_id", null);
}

async function insertTable(table) {
  return (await knex("tables").insert(table).returning("table_id"))[0];
}

async function assignReservationToSeat(tableID, reservation) {
  let table = await knex("tables")
    .where("capacity", ">=", reservation.people)
    .andWhere("reservation_id", null)
    .andWhere("table_id", tableID)
    .first();

  if (!table)
    throw new Error(
      "No valid table! [Either the table is already occupied or has too little capacity]"
    );

  await knex.transaction(async (trans) => {
    await trans("tables")
      .update("reservation_id", reservation.reservation_id)
      .where("table_id", tableID);
    await trans("reservations")
      .update("status", "seated")
      .where("reservation_id", reservation.reservation_id);
  });
}

async function deleteSeating(table) {
  if (!table.reservation_id) throw new Error("Table not occupied!");

  await knex.transaction(async (trans) => {
    await trans("reservations")
      .update({ status: "finished" })
      .where("reservation_id", table.reservation_id);
    await trans("tables")
      .update({ reservation_id: null })
      .where("table_id", table.table_id);
  });
}

module.exports = {
  getTables,
  getTable,
  insertTable,
  assignReservationToSeat,
  availableSeats,
  deleteSeating,
};
