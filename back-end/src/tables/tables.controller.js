const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { tableSchema } = require("../utils/validation");
const { getTables, insertTable } = require("./tables.service");

async function list(req, res, next) {
  res.json(await getTables());
}

async function newTable(req, res, next) {
  await tableSchema.validate(req.body);
  await insertTable(req.body);
  res.sendStatus(200);
}

module.exports = {
  newTable: asyncErrorBoundary(newTable, 400),
  list: asyncErrorBoundary(list, 400),
};
