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
      let testAppointment = [{type: 'Test Type', status:'Test Status', date: 'Today', time: 'Now', clientId: 'ClientID:123' }];
      
      let result = await appointmentModel.find();
      return testAppointment;
  }

  exports.getAppointments = getAppointments;