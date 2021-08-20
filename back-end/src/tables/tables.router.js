/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./tables.controller");

router.route("/").get(controller.getTables);
router.route("/").post(controller.insertTable);

router.route("/:table_id/seat").put(controller.seat);
router.route("/:table_id/seat").delete(controller.deleteSeating);

module.exports = router;
