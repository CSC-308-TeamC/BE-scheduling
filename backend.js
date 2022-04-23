const express = require("express");
const cors = require("cors");
const appointmentServices = require("./DB-Modules/Services/appointment-services");
const clientServices = require("./DB-Modules/Services/client-services");
const dogServices = require("./DB-Modules/Services/dog-services");
const userServices = require("./DB-Modules/Services/user-services");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

//Get requests-------------------------------------------------------------------------------------------------------
app.get("/", (req, res) => {
  res.redirect("/dashboard");
});

app.get("/dashboard", async (req, res) => {
  const result = await appointmentServices.getTodaysAppointments();
  res.send({ appointmentData: result });
});

app.get("/appointments", async (req, res) => {
  const result = await appointmentServices.getAppointments();
  res.send({ appointmentData: result });
});

app.get("/appointments/:id/:format", async (req, res) => {
  const id = req.params.id;
  const format = req.params.format;
  var result;
  result = await appointmentServices.getAppointmentById(id, format);

  if (result) {
    res.send({ appointmentData: result });
  } else {
    res.status(404).send("Resource not found");
  }
});

app.get("/clients", async (req, res) => {
  const result = await clientServices.getClients();
  res.send({ clientData: result });
});

app.get("/clients/:id", async (req, res) => {
  const id = req.params.id;
  const result = await clientServices.getClientById(id);
  if (result) res.send({ clientData: result }).end();
  else res.status(404).send("Resource not found");
});

app.get("/dogs", async (req, res) => {
  const result = await dogServices.getDogs();
  res.send({ dogData: result });
});

app.get("/dogs/:id", async (req, res) => {
  const id = req.params.id;
  const result = await dogServices.getDogById(id);
  if (result) res.send({ dogData: result }).end();
  else res.status(404).send("Resource not found");
});

app.get("/users", async (req, res) => {
  const result = await userServices.getUsers();
  res.send({ userData: result });
});

app.get("/users/:email", async (req, res) => {
  const email = req.params.email;
  const result = await userServices.getUsers();
  res.send({ userData: result });
});
//Post Requests-------------------------------------------------------------------------------------------------------
app.post("/appointments", async (req, res) => {
  const newAppointment = req.body;
  const savedAppointment = await appointmentServices.addAppointment(
    newAppointment
  );
  if (savedAppointment)
    res.status(201).send({ appointmentData: savedAppointment });
  else res.status(500).end();
});

app.post("/clients", async (req, res) => {
  const newClient = req.body;
  const savedClient = await clientServices.addClient(newClient);
  if (savedClient) res.status(201).send({ clientData: savedClient });
  else res.status(500).end();
});

app.post("/dogs", async (req, res) => {
  const newDog = req.body;
  const savedDog = await dogServices.addDog(newDog);
  if (savedDog) res.status(201).send({ dogData: savedDog });
  else res.status(500).end();
});

//Sign Up -------------------- Sign In
function generateAccessToken(username) {
  return jwt.sign({ username: username }, process.env.TOKEN_SECRET, {
    expiresIn: "150s",
  });
}

app.post("/signup", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send("Bad request: Invalid input data.");
  } else {
    if (!userServices.getUserByEmail(email)) {
      res.status(409).send("Username already taken.");
    } else {
      const addedUser = userServices.addUser(req.body);
      if (!addedUser) {
        res.status(403).send("Password does not meet complexity requirements.");
      } else {
        const token = generateAccessToken(addedUser.email);
        res.status(201).send(token);
      }
    }
  }
});

app.post("/login", async (req, res) => {
  const userEmail = req.body.email;

  const retrievedUser = userServices.getUserByEmail(userEmail);

  if (retrievedUser.email && retrievedUser.password) {
    const isValid = await bcrypt.compare(pwd, retrievedUser.pwd);
    if (isValid) {
      // Generate token and respond
      const token = generateAccessToken(userEmail);
      res.status(200).send(token);
    } else {
      //Unauthorized due to invalid pwd
      res.status(401).send("Unauthorized");
    }
  } else {
    //Unauthorized due to invalid username
    res.status(401).send("Unauthorized");
  }
});

/* Using this funcion as a "middleware" function for
    all the endpoints that need access control protecion */
function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  //Getting the 2nd part of the auth hearder (the token)
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("No token received");
    return res.status(401).end();
  } else {
    // If a callback is supplied, verify() runs async
    // If a callback isn't supplied, verify() runs synchronously
    // verify() throws an error if the token is invalid
    try {
      // verify() returns the decoded obj which includes whatever objs
      // we use to code/sign the token
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      // in our case, we used the username to sign the token
      console.log(decoded);
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).end();
    }
  }
}

//Patch requests-------------------------------------------------------------------------------------------------------
app.patch("/appointments", async (req, res) => {
  const appointmentToUpdate = req.body;
  const updatedAppointment = await appointmentServices.updateAppointment(
    appointmentToUpdate
  );
  if (updatedAppointment)
    res.status(200).send({ appointmentData: updatedAppointment });
  else res.status(404).end();
});

app.patch("/clients", async (req, res) => {
  const clientToUpdate = req.body;
  const updatedClient = await clientServices.updateClient(clientToUpdate);
  if (updatedClient) res.status(200).send({ clientData: clientToUpdate });
  else res.status(404).end();
});

app.patch("/dogs", async (req, res) => {
  const dogToUpdate = req.body;
  const updatedDog = await dogServices.updateDog(dogToUpdate);
  if (updatedDog) res.status(200).send({ dogData: updatedDog });
  else res.status(404).end();
});

//Delete requests-------------------------------------------------------------------------------------------------------
app.delete("/appointments/:id", async (req, res) => {
  const id = req.params.id;
  const result = await appointmentServices.deleteAppointmentById(id);
  if (result) {
    res.status(204).end();
  } else {
    res.status(404).send("Resource not found");
  }
});

app.delete("/clients/:id", async (req, res) => {
  const id = req.params.id;
  const result = await clientServices.deleteClientById(id);
  if (result) {
    res.status(204).end();
  } else {
    res.status(404).send("Resource not found");
  }
});

app.delete("/dogs/:id", async (req, res) => {
  const id = req.params.id;
  const result = await dogServices.deleteDogById(id);
  if (result) {
    res.status(204).end();
  } else {
    res.status(404).send("Resource not found");
  }
});

app.listen(process.env.PORT || port, () => {
  console.log(`Rest API Listening`);
});
