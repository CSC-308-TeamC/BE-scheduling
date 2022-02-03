const res = require('express/lib/response');
const mongoose = require('mongoose');
const AppointmentSchema = require('./appointment');
let dbConnection;

function getDbConnection() {
    if (!dbConnection) {
        dbConnection = mongoose.createConnection("mongodb://localhost:27017/appointments", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }
    return dbConnection;
  }

  async function getAppointments(){
      const appointmentModel = getDbConnection().model('Appointment', AppointmentSchema);
      let result = await appointmentModel.find();
      return result;
  }

  exports.getAppointments = getAppointments;