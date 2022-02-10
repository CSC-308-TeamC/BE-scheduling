const mongoose = require('mongoose');
const AppointmentSchema = require('./appointment');
import dbConnection from './models/dbConnection'
let dbConnection = dbConnection.getDbConnection();

  async function getAppointments(){
      const appointmentModel = getDbConnection().model('Appointment', AppointmentSchema);
      let testAppointment = [{type: 'Test Type', status:'Test Status', date: 'Today', time: 'Now', clientId: 'Test clientID' }];
      
      let result = await appointmentModel.find();
      return testAppointment;
  }

  exports.getAppointments = getAppointments;