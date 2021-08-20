/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");

router.route("/").get(controller.getReservations);
router.route("/").post(controller.insertReservation);

router.route("/:reservation_id").get(controller.getReservation);
router.route("/:reservation_id").put(controller.updateReservation);
router.route("/:reservation_id/status").put(controller.updateReservationStatus);

module.exports = router;
