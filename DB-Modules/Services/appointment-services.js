const res = require("express/lib/response");
const AppointmentSchema = require("../Models/appointment");
const clientServices = require("./client-services");
const dogServices = require("./dog-services");
const dbConnection = require("../dbConnection");
const { startOfToday } = require("date-fns");
const { startOfTomorrow } = require("date-fns");
let dbC;

function setConnection(newConnection) {
  dbC = newConnection;
  return dbC;
}

async function getAppointments(format = true) {
  dbC = dbConnection.getDbConnection(dbC);
  const appointmentModel = dbC.model("Appointment", AppointmentSchema);
  try {
    let appointmentsResults = await appointmentModel.find().lean();

    if (format) {
      appointmentResults = await formatAppointmentsArray(appointmentsResults);
    }

    return appointmentsResults;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getAppointmentById(id, format = true) {
  dbC = dbConnection.getDbConnection(dbC);
  const appointmentModel = dbC.model("Appointment", AppointmentSchema);
  try {
    let appointmentResult = await appointmentModel.findById(id).lean();

    if (JSON.parse(format))
      appointmentResult = await formatAppointment(appointmentResult);

    return appointmentResult;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getTodaysAppointments() {
  dbC = dbConnection.getDbConnection(dbC);
  const appointmentModel = dbC.model("Appointment", AppointmentSchema);
  let appointmentsResult = await appointmentModel
    .find({ dateTime: { $gte: startOfToday(), $lte: startOfTomorrow() } })
    .lean();
  await formatAppointmentsArray(appointmentsResult, true);
  return appointmentsResult;
}

async function addAppointment(appointment) {
  dbC = dbConnection.getDbConnection(dbC);
  const appointmentModel = dbC.model("Appointment", AppointmentSchema);
  try {
    const appointmentToAdd = new appointmentModel(appointment);
    var savedAppointment = await appointmentToAdd.save();

    await formatAppointment(appointment);
    appointment._id = savedAppointment._id;

    return appointment;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function updateAppointment(appointment) {
  dbC = dbConnection.getDbConnection(dbC);
  const appointmentModel = dbC.model("Appointment", AppointmentSchema);
  try {
    let updatedAppointment = await appointmentModel
      .findOneAndUpdate(
        { _id: appointment._id },
        {
          type: appointment.type,
          status: appointment.status,
          dateTime: appointment.dateTime,
          clientId: appointment.clientId,
          dogId: appointment.dogId,
          notes: appointment.notes,
          repeating: appointment.repeating,
        },
        { returnOriginal: false }
      )
      .lean();
    await formatAppointment(updatedAppointment);
    return updatedAppointment;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function deleteAppointmentById(id) {
  dbC = dbConnection.getDbConnection(dbC);
  const appointmentModel = dbC.model("Appointment", AppointmentSchema);
  try {
    return await appointmentModel.findByIdAndRemove(id);
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function formatAppointmentsArray(appointments, forToday = false) {
  let appointmentsConv = [];
  if (appointments.length != 0) {
    appointmentsConv = await Promise.all(
      appointments.map(async (appointment) => {
        return await formatAppointment(appointment, forToday);
      })
    );
  }
  return appointmentsConv;
}

async function formatAppointment(appointment, forToday) {
  if (appointment) {
    let client = await clientServices.getClientById(appointment.clientId);
    let dog = await dogServices.getDogById(appointment.dogId);

    delete appointment.clientId;
    delete appointment.dogId;

    appointment["clientName"] = client.fullName;
    appointment["dogName"] = dog.name;

    let date = new Date(appointment.dateTime);

    if (forToday)
      appointment["dateTime"] = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    else
      appointment["dateTime"] =
        date.toLocaleDateString("en-US") +
        " " +
        date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        });

    return appointment;
  }
}

exports.setConnection = setConnection;
exports.getAppointments = getAppointments;
exports.getAppointmentById = getAppointmentById;
exports.getTodaysAppointments = getTodaysAppointments;
exports.addAppointment = addAppointment;
exports.updateAppointment = updateAppointment;
exports.deleteAppointmentById = deleteAppointmentById;
