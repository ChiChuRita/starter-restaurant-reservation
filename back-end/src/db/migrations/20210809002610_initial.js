exports.up = function (knex) {
    return knex.schema.alterTable("reservations", (table) => {
      table.string("first_name");
      table.string("last_name");
      table.integer("people");
      table.string("mobile_number");
      table.date("reservation_date");
      table.time("reservation_time");
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("reservations");
  };