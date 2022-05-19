const express = require("express");
const cors = require("cors");
const appointmentRouter = require("./API-Modules/Controller-Routes/Appointment-Routes");
const clientRouter = require("./API-Modules/Controller-Routes/Client-Routes");
const dogRouter = require("./API-Modules/Controller-Routes/Dog-Routes");
const userRouter = require("./API-Modules/Controller-Routes/User-Routes");
const dotenv = require("dotenv");
dotenv.config();
const server = express();
const port = 5000;
server.use(cors());
server.use(express.json());

//Get requests-------------------------------------------------------------------------------------------------------
server.get("/", (req, res) => {
  res.redirect("/appointments");
});

server.use("/appointments", appointmentRouter);

server.use("/clients", clientRouter);

server.use("/dogs", dogRouter);

server.use("/users", userRouter);

server.listen(process.env.PORT || port, () => {
  console.log(`Rest API Listening`);
});
