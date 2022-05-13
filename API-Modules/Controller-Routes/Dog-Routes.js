const express = require("express");
const router = express.Router();
const { authenticateUser } = require("./Authentication-Middleware");
const dogController = require("../Controllers/Dog-Controller");

router.use((req, res, next) => authenticateUser(req, res, next));
//router.use((req, res, next) => next());

router.get("/", dogController.get);

router.get("/:id", dogController.getById);

router.post("/", dogController.create);

router.patch("/", dogController.update);

router.delete("/:id", dogController.remove);

module.exports = router;
