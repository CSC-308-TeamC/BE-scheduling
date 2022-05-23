const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

/* Using this funcion as a "middleware" function for
    all the endpoints that need access control protecion */
function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  //Getting the 2nd part of the auth hearder (the token)
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    //No token
    return res.status(401).send("No token");
  } else {
    // If a callback is supplied, verify() runs async
    // If a callback isn't supplied, verify() runs synchronously
    // verify() throws an error if the token is invalid
    try {
      // verify() returns the decoded obj which includes whatever objs
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      next();
      // const checkedUser = userServices.getUserByEmail(decoded);
      // if (checkedUser && checkedUser.administrator) //User exists and is authorized
      //     next();
      // else
      //     throw "User not found";
    } catch (error) {
      //Invalid Token
      console.log(error);
      return res.status(401).end();
    }
  }
}

exports.authenticateUser = authenticateUser;
