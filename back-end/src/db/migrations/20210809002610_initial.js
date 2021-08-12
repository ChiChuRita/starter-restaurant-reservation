exports.up = function (knex) {
  return knex.schema.alterTable("reservations", (table) => {
    table.string("first_name");
    table.string("last_name");
    table.integer("people");
    table.string("mobile_number");
    table.date("reservation_date");
    table.time("reservation_time");
    table.integer("table_id");
  });
};

exports.down = function (knex) {};
