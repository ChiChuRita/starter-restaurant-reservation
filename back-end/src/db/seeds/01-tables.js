const fs = require("fs");
const path = require("path");

//seeds the reservations table for testing purpose
exports.seed = function (knex) {
  return knex("tables")
    .del()
    .then(function () {
      return knex("tables").insert(
        JSON.parse(fs.readFileSync(path.join(__dirname, "01-tables.json")))
      );
    });
};
