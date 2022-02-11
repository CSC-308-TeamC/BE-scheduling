const mongoose = require('mongoose');
const AppointmentSchema = require('./appointment');
const dbConnection = require('./dbConnection');
let dbC = dbConnection.getDbConnection();

  async function getAppointments(){
      const appointmentModel = dbC.model('Appointment', AppointmentSchema);
      let testAppointment = [{type: 'Test Type', status:'Test Status', date: 'Today', time: 'Now', clientId: 'Test clientID' }];
      
      let result = await appointmentModel.find();
      return testAppointment;
  }

  exports.getAppointments = getAppointments;