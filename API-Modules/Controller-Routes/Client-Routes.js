const express = require("express");
const router = express.Router();
const { authenticateUser } = require("./Authentication-Middleware");
const clientController = require("../Controllers/Client-Controller");

router.use((req, res, next) => authenticateUser(req, res, next));
// router.use((req, res, next) => next());

router.get("/", clientController.get);

router.get("/:id", clientController.getById);

router.post("/", clientController.create);

router.patch("/", clientController.update);

router.delete("/:id", clientController.remove);

module.exports = router;
