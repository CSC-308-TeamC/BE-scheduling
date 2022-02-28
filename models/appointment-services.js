const res = require('express/lib/response');
const AppointmentSchema = require('./appointment');
const clientServices = require('./client-services');
const dogServices = require('./dog-services');
const dbConnection = require('./dbConnection');
const { format } = require('express/lib/response');
let dbC;

async function getAppointments() {
  dbC = dbConnection.getDbConnection();
  const appointmentModel = dbC.model('Appointment', AppointmentSchema); 
  //let formattedResult = await formatAppointmentsArray(await appointmentModel.find().lean());
  let defaultRestult = await appointmentModel.find();
  return defaultRestult;
}

async function addAppointment(appointment) {
  dbC = dbConnection.getDbConnection();
  const appointmentModel = dbC.model('Appointment', AppointmentSchema);
  try {
    const appointmentToAdd = new appointmentModel(appointment);
    var savedAppointment = await appointmentToAdd.save();

    let formattedAppointment = await formatAppointment(appointment);
    formattedAppointment._id = savedAppointment._id;

    return formattedAppointment;
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

async function formatAppointmentsArray(appointments){
  let appointmentsConv = [];
  if(appointments.length != 0){
    //Change all Id's to names and date to clearer format, all for frontend.
    appointmentsConv = await Promise.all(appointments.map(async (appointment) => {
      return await formatAppointment(appointment);      
    }));
  }
  return appointmentsConv;
}

async function formatAppointment(appointment){
  if(appointment){
    let client = await clientServices.getClientById(appointment.clientId);
    let dog = await dogServices.getDogById(appointment.dogId);

    delete appointment.clientId;
    delete appointment.dogId;
    
    appointment['clientName'] = client.firstName + " " + client.lastName;
    appointment['dogName'] = dog.name;
    
    let date = new Date(appointment.dateTime);
    appointment['dateTime'] = date.toLocaleDateString('en-US') + " " + date.toLocaleTimeString('en-US');
    
    return appointment; 
  } 
}


// module.exports = {
//   getAppointments,
//   addAppointment,
//   deleteAppointmentById
// }
exports.getAppointments = getAppointments;
exports.addAppointment = addAppointment;
exports.deleteAppointmentById = deleteAppointmentById;