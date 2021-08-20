const fs = require("fs");
const path = require("path");

//seeds the tables table for testing purpose (US-04)
exports.seed = function (knex) {
  return knex
    .raw("TRUNCATE TABLE tables RESTART IDENTITY CASCADE")
    .then(function () {
      return knex("tables").insert(
        JSON.parse(fs.readFileSync(path.join(__dirname, "01-tables.json")))
      );
    });
};
