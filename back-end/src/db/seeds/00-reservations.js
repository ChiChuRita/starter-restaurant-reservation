const fs = require("fs");
const path = require("path");

//seeds the reservations table for testing purpose
exports.seed = function(knex) {
  return knex('reservations').del()
    .then(function () {
      return knex('reservations').insert(JSON.parse(fs.readFileSync(path.join(__dirname, "00-reservations.json"))));
    });
};
