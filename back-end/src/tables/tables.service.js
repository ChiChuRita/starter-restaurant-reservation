const knex = require("../db/connection");

//gets all table entries
async function getTables() {
  return await knex("tables").orderBy("table_name");
}

//gets the table data of the table with the table_id (US-04)
async function getTable(tableID) {
  return await knex("tables").where("table_id", tableID).first();
}

//inserts a new table to the database and returns the assigned table_id (US-04)
async function insertTable(table) {
  return (await knex("tables").insert(table).returning("table_id"))[0];
}

//validates if the requested table is suitable for the reseravation
//the table has to offer enough capacity and must not be already assigned (US-04)
async function checkTable(tableID, reservation) {
  return await knex("tables")
    .where("capacity", ">=", reservation.people)
    .andWhere("reservation_id", null)
    .andWhere("table_id", tableID)
    .first();
}

//assigns a table to a reservation by assigning a reservation_id to the table entry
//and setting the reservation status to seated (US-04)
async function seat(table, reservation) {
  //transaction to ensure the database stays consistent
  await knex.transaction(async (trans) => {
    await trans("tables")
      .update("reservation_id", reservation.reservation_id)
      .where("table_id", table.table_id);
    await trans("reservations")
      .update("status", "seated")
      .where("reservation_id", reservation.reservation_id);
  });
}

//removes an assigment of the table by removing the reservation_id
//and setting the status of the reservation to finished (US-05)
async function deleteSeating(table) {
  //transaction to ensure the database stays consistent
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
  checkTable,
  seat,
  deleteSeating,
};
