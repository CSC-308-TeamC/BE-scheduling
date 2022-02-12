const res = require('express/lib/response');
const mongoose = require('mongoose');
let dbConnection;

function getDbConnection(){
    if (!dbConnection) {
        dbConnection = mongoose.createConnection("mongodb://localhost:27017/appointments", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }
    return dbConnection;
  }

  exports.getDbConnection = getDbConnection;
