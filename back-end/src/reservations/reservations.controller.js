/**
 * List handler for reservation resources
 */

const knex = require("../db/connection");
const { today } = require("../utils/date-time");

const list = async (req, res) => {
  try
  {
    const dateQuery = req.query.date || today();
    const entries = await (knex.select().from("reservations").where("reservation_date", dateQuery).orderBy("reservation_time"));
    res.json(entries);
  }
  catch (err)
  {
    res.status(400).json({ error: err.message });
  }
}

// user story 1
const createNewOrder = async (req, res) => {
  console.log(req.body);
  res.send("NICE!");
}

module.exports = {
  list, createNewOrder
};
