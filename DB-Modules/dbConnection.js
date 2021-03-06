const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

let dbConnection;

// function getDbConnection(){
//     if (!dbConnection) {
//         dbConnection = mongoose.createConnection("mongodb://localhost:27017/appointments", {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//     }
//     return dbConnection;
//   }

function getDbConnection(dbC) {
  dbConnection = dbC;
  if (!dbConnection) {
    dbConnection = mongoose.createConnection(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  return dbConnection;
}

exports.getDbConnection = getDbConnection;
