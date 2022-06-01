const appointmentServices = require("../../DB-Modules/Services/appointment-services");

async function get(req, res) {
  const date = req.query.date;
  const format = req.query.format;
  if (date) {
    const result = await appointmentServices.getTodaysAppointments();
    res.send({ appointmentData: result });
  } else {
    const result = await appointmentServices.getAppointments(format);
    res.send({ appointmentData: result });
  }
}

async function getById(req, res) {
  const id = req.params.id;
  const format = req.query.format;
  var result = await appointmentServices.getAppointmentById(id, format);

  if (result) {
    res.send({ appointmentData: result });
  } else {
    res.status(404).send("Resource not found");
  }
}

async function create(req, res) {
  const newAppointment = req.body;
  const savedAppointment = await appointmentServices.addAppointment(
    newAppointment
  );
  if (savedAppointment)
    res.status(201).send({ appointmentData: savedAppointment });
  else res.status(500).end();
}

async function update(req, res) {
  const appointmentToUpdate = req.body;
  const updatedAppointment = await appointmentServices.updateAppointment(
    appointmentToUpdate
  );
  if (updatedAppointment)
    res.status(200).send({ appointmentData: updatedAppointment });
  else res.status(404).end();
}

async function remove(req, res) {
  const id = req.params.id;
  const result = await appointmentServices.deleteAppointmentById(id);
  if (result) {
    res.status(204).end();
  } else {
    res.status(404).send("Resource not found");
  }
}

module.exports = {
  get,
  getById,
  create,
  update,
  remove,
};
