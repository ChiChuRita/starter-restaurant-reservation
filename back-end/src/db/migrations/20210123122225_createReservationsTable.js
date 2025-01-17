exports.up = function (knex) {
  return knex.schema.createTable("reservations", (table) => {
    table.increments("reservation_id").primary();
    table.timestamps(true, true);
    table.string("first_name");
    table.string("last_name");
    table.integer("people");
    table.string("mobile_number");
    table.date("reservation_date");
    table.time("reservation_time");
    table.string("status").defaultTo("booked");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("reservations");
};
