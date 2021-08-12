const knex = require("../db/connection");

async function getTables() {
  return await knex("tables").orderBy("table_name");
}

async function insertTable(table) {
  await knex("tables").insert(table);
}

module.exports = {
  getTables,
  insertTable,
};
