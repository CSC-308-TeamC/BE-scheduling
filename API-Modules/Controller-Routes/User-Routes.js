const express = require("express");
const router = express.Router();
const { authenticateUser } = require("./Authentication-Middleware");
const userController = require("../Controllers/User-Controller");

router.get("/", userController.get);

router.get("/:id", userController.getByEmail);

router.post("/signUp", userController.signUp);

router.post("/signIn", userController.signIn);

//router.patch("/", userController.update);

router.delete("/:email", userController.remove);

router.use(function (req, res, next) {
  next();
});

module.exports = router;
