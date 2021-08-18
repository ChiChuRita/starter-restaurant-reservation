/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./tables.controller");

router.route("/").get(controller.list);
router.route("/").post(controller.newTable);
router.route("/freetables").get(controller.getAvailableTables);
router.route("/:table_id/seat").put(controller.assignSeat);
router.route("/:table_id/seat").delete(controller.deleteAssignment);

module.exports = router;
