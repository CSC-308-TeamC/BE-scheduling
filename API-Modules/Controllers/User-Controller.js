const userServices = require("../../DB-Modules/Services/user-services");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

async function get(req, res) {
  const result = await userServices.getUsers();
  res.send({ userData: result });
}

async function getByEmail(req, res) {
  const email = req.params.email;
  const result = await userServices.getUserByEmail(email);
  if (result) res.send({ userData: result }).end();
  else res.status(404).send("Resource not found");
}

function generateAccessToken(email) {
  return jwt.sign({ email: email }, process.env.TOKEN_SECRET, {
    expiresIn: "150s",
  });
}

async function signUp(req, res) {
  if (!req.body.email || !req.body.password) {
    //Missing password or Missing Email
    res.status(400).send("Bad request: Invalid input data.");
  } else {
    //Has password and email
    if (!userServices.getUserByEmail(req.body.email)) {
      //Email has already been used
      res.status(409).send("Email already taken.");
    } else {
      const newUser = await userServices.addUser(req.body);
      if (!newUser) {
        //User not required because failed to be added by data annotations
        res.status(403).send("Password does not meet complexity requirements.");
      } else {
        //Successfully signed up
        const token = generateAccessToken(newUser.email);
        res.status(201).send({ tokenData: token, email: newUser.email });
      }
    }
  }
}

async function signIn(req, res) {
  const passedUser = req.body;
  const retrievedUser = await userServices.getUserByEmail(passedUser.email);
  if (retrievedUser) {
    //User exists in DB
    const isValid = await bcryptjs.compare(
      passedUser.password,
      retrievedUser.password
    );
    if (isValid) {
      //Valid Credentials
      const token = generateAccessToken(passedUser.email);
      res
        .status(200)
        .send({ tokenData: token, emailData: retrievedUser.email });
    } else {
      //Invalid Password
      res.status(401).send("Unauthorized");
    }
  } else {
    //Invalid Email
    res.status(401).send("Unauthorized");
  }
}

async function update(req, res) {
  const userToUpdate = req.body;
  const updatedUser = await UserServices.updateUser(userToUpdate);
  if (updatedUser) res.status(200).send({ userData: updatedUser });
  else res.status(404).end();
}

async function remove(req, res) {
  const email = req.params.email;
  const result = await userServices.deleteUserByEmail(email);
  if (result) {
    res.status(204).end();
  } else {
    res.status(404).send("Resource not found");
  }
}

module.exports = {
  get,
  getByEmail,
  signUp,
  signIn,
  update,
  remove,
};
