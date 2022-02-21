const res = require('express/lib/response');
const AppointmentSchema = require('./appointment');
const clientServices = require('./client-services');
const dogServices = require('./dog-services');
const dbConnection = require('./dbConnection');
let dbC;

async function getAppointments() {
  dbC = dbConnection.getDbConnection();
  const appointmentModel = dbC.model('Appointment', AppointmentSchema); 
  let formattedResult = await formatAppointments(await appointmentModel.find().lean());
  return formattedResult;
}

async function addAppointment(appointment) {
  dbC = dbConnection.getDbConnection();
  const appointmentModel = dbC.model('Appointment', AppointmentSchema);
  try {
    const appointmentToAdd = new appointmentModel(appointment);
    const savedAppointment = await appointmentToAdd.save()
    return savedAppointment;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function deleteAppointmentById(id) {
  dbC = dbConnection.getDbConnection();
  const appointmentModel = dbC.model('Appointment', AppointmentSchema);
  try {
    return await appointmentModel.findByIdAndRemove(id);
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function formatAppointments(appointments){
  let appointmentsConv = [];
  if(appointments.length != 0){
    //Change all Id's to names and date to clearer format, all for frontend.
    appointmentsConv = await Promise.all(appointments.map(async (appointment) => {
      let client = await clientServices.getClientById(appointment.clientId);
      let dog = await dogServices.getDogById(appointment.dogId);

      delete appointment.clientId;
      delete appointment.dogId;
      
      appointment['clientName'] = client.firstName + " " + client.lastName;
      appointment['dogName'] = dog.name;
      
      let date = new Date(appointment.dateTime);
      appointment['dateTime'] = date.toLocaleDateString('en-US') + " " + date.toLocaleTimeString('en-US');
      
      return appointment;      
    }));
  }
  return appointmentsConv;
}


// module.exports = {
//   getAppointments,
//   addAppointment,
//   deleteAppointmentById
// }
exports.getAppointments = getAppointments;
exports.addAppointment = addAppointment;
exports.deleteAppointmentById = deleteAppointmentById;