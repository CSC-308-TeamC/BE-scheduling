const AppointmentSchema = require('./appointment');
const dbConnection = require('./dbConnection');
let dbC;

async function getAppointments() {
  dbC = dbConnection.getDbConnection();
  const appointmentModel = dbC.model('Appointment', AppointmentSchema);

  let result = await appointmentModel.find();
  return result;
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

exports.getAppointments = getAppointments;
exports.addAppointment = addAppointment;
exports.deleteAppointmentById = deleteAppointmentById;