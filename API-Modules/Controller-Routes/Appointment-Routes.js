const express = require("express");
const router = express.Router();
const { authenticateUser } = require("./Authentication-Middleware");
const appointmentController = require("../Controllers/Appointment-Controller");

router.use((req, res, next) => authenticateUser(req, res, next));
// router.use((req, res, next) => next());

router.get("/", appointmentController.get);

router.get("/:id", appointmentController.getById);

router.post("/", appointmentController.create);

router.patch("/", appointmentController.update);

router.delete("/:id", appointmentController.remove);

module.exports = router;
