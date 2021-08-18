/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");

router.route("/").get(controller.list);
router.route("/").post(controller.createNewOrder);

router.route("/:reservation_id").get(controller.listByID);
router.route("/:reservation_id").put(controller.update);
router.route("/:reservation_id/status").put(controller.setStatus);

module.exports = router;
