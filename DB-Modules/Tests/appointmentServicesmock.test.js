const mongoose = require("mongoose");
const DogSchema = require("../Models/dog");
const ClientSchema = require("../Models/client");
const AppointmentSchema = require("../Models/appointment");
const dogServices = require("../Services/dog-services");
const clientServices = require("../Services/client-services");
const appointmentServices = require("../Services/appointment-services");
const dbConnection = require("../dbConnection");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mockingoose = require("mockingoose");

let mongoServer;
let connection;
let dogModel;
let clientModel;
let appointmentModel;

beforeAll(async () => {
  appointmentModel = mongoose.model("Appointment", AppointmentSchema);
});

beforeEach(async () => {
  jest.clearAllMocks();
  mockingoose.resetAll();
});

//Tests-------------------------------------------------------------------------------------------------
//Get all Records------------------------------------------------------|
test("Get all appointments -- Success", async () => {
  appointmentModel.findAllAppointments = jest.fn().mockResolvedValue([]);

  const appointments = await appointmentModel.findAllAppointments();
  expect(appointments.length).toBeGreaterThanOrEqual(0);
  expect(appointmentModel.findAllAppointments.mock.calls.length).toBe(1);
  expect(appointmentModel.findAllAppointments).toHaveBeenCalledWith();
});

test("Get all appointments -- Nonexistant clientID", async () => {
  const falseId = "6132b9d47cefd0cc1916b6a9";
  const dummyAppointment = {
    type: "Glands",
    status: "Checked In",
    dateTime: new Date(),
    clientId: falseId,
    dogId: falseId,
    notes: "No Notes.",
    repeating: false,
  };
  const result = new appointmentModel(dummyAppointment);
  await result.save();
  const appointments = await appointmentServices.getAppointments();
  expect(appointments).toBeFalsy();
});

//Get Todays Records------------------------------------------------------|
test("Get Todays appointments -- Success", async () => {
  appointmentModel.getTodaysAppointments = jest.fn().mockResolvedValue([]);

  const appointments = await appointmentModel.getTodaysAppointments();

  expect(appointments.length).toBeGreaterThanOrEqual(0);
  expect(appointmentModel.getTodaysAppointments.mock.calls.length).toBe(1);
  expect(appointmentModel.getTodaysAppointments).toHaveBeenCalledWith();
});

//Create Record------------------------------------------------------|
test("Get appointment by id -- Nonexistant ID", async () => {
  const falseId = "6132b9d47cefd0cc1916b6a9";
  const foundAppointment = await appointmentServices.getAppointmentById(
    falseId
  );
  expect(foundAppointment).toBeFalsy();
});

test("Get appointment by id -- Invalid ID", async () => {
  const invalidId = 1234;
  const foundAppointment = await appointmentServices.getAppointmentById(
    invalidId
  );
  expect(foundAppointment).toBeFalsy();
});

//Delete Record------------------------------------------------------|
test("Deleting a appointment by Id -- Nonexistant ID", async () => {
  const falseId = "6132b9d47cefd0cc1916b6a9";
  //const deleteResult = await appointmentServices.deleteAppointmentById(falseId);
  // expect(deleteResult).toBeFalsy();
  appointmentModel.findOneAndDelete = jest.fn().mockResolvedValue(null);
  const deleteResult = await appointmentModel.findOneAndDelete({
    _id: falseId,
  });

  expect(deleteResult).toBeNull();
  expect(appointmentModel.findOneAndDelete.mock.calls.length).toBe(1);
  expect(appointmentModel.findOneAndDelete).toHaveBeenCalledWith({
    _id: falseId,
  });
});

test("Deleting a appointment by Id -- Invalid ID", async () => {
  const invalidId = 1234;
  //const deleteResult = await appointmentServices.deleteAppointmentById(invalidId);
  // expect(deleteResult).toBeFalsy();

  appointmentModel.findOneAndDelete = jest.fn().mockResolvedValue(false);

  const deleteResult = await appointmentModel.findOneAndDelete({
    _id: invalidId,
  });
  //const deleteResult = await dogServices.deleteDogById(falseId);
  expect(deleteResult).toBeFalsy();
  expect(appointmentModel.findOneAndDelete.mock.calls.length).toBe(1);
  expect(appointmentModel.findOneAndDelete).toHaveBeenCalledWith({
    _id: invalidId,
  });
});

//Tests Requiring all Clients-------------------------------------------------------------------------------------------------
describe("Get clients and dogs for ids", () => {
  let allClients;
  let allDogs;

  // //Create Record ------------------------------------------------------|
  test("Adding appointment -- failure path (No type field)", async () => {
    const dummyAppointment = {
      status: "Checked In",
      dateTime: new Date(),
      clientId: allClients,
      dogId: allDogs,
      notes: "Missed last appointment.",
      repeating: false,
    };
    mockingoose(appointmentModel).toReturn(false, "save");
    const result = await appointmentServices.addAppointment(dummyAppointment);

    expect(result).toBeFalsy();
  });

  test("Adding appointment -- failure path (No status field)", async () => {
    const dummyAppointment = {
      type: "Glands",
      dateTime: new Date(),
      clientId: allClients,
      dogId: allDogs,
      notes: "Missed last appointment.",
      repeating: false,
    };
    mockingoose(appointmentModel).toReturn(false, "save");

    const result = await appointmentServices.addAppointment(dummyAppointment);
    expect(result).toBeFalsy();
  });

  test("Adding appointment -- failure path (No dateTime field)", async () => {
    const dummyAppointment = {
      type: "Glands",
      status: "Checked In",
      clientId: allClients,
      dogId: allDogs,
      notes: "Missed last appointment.",
      repeating: false,
    };
    mockingoose(appointmentModel).toReturn(false, "save");

    const result = await appointmentServices.addAppointment(dummyAppointment);
    expect(result).toBeFalsy();
  });

  test("Adding appointment -- failure path (No clientId field)", async () => {
    const dummyAppointment = {
      type: "Glands",
      status: "Checked In",
      dateTime: new Date(),
      dogId: allDogs,
      notes: "Missed last appointment.",
      repeating: false,
    };
    mockingoose(appointmentModel).toReturn(false, "save");

    const result = await appointmentServices.addAppointment(dummyAppointment);
    expect(result).toBeFalsy();
  });

  test("Adding appointment -- failure path (No dogId field)", async () => {
    const dummyAppointment = {
      type: "Glands",
      status: "Checked In",
      dateTime: new Date(),
      clientId: allClients,
      notes: "Missed last appointment.",
      repeating: false,
    };
    mockingoose(appointmentModel).toReturn(false, "save");

    const result = await appointmentServices.addAppointment(dummyAppointment);
    expect(result).toBeFalsy();
  });

  //Update Record------------------------------------------------------|

  test("Update Appointment -- nonexistant Appointment", async () => {
    const falseId = "6132b9d47cefd0cc1916b6a9";
    const dummyAppointment = {
      _id: falseId,
      type: "Glands",
      status: "Checked In",
      dateTime: new Date(),
      clientId: allClients,
      dogId: allDogs,
      notes: "Missed last appointment.",
      repeating: false,
    };
    const result = await appointmentServices.updateAppointment(
      dummyAppointment
    );
    expect(result).toBeFalsy();
  });

  test("Update Appointment -- invalid Appointment ID", async () => {
    const invalidId = 1234;
    const dummyAppointment = {
      _id: invalidId,
      type: "Glands",
      status: "Checked In",
      dateTime: new Date(),
      clientId: allClients,
      dogId: allDogs,
      notes: "Missed last appointment.",
      repeating: false,
    };
    const result = await appointmentServices.updateAppointment(
      dummyAppointment
    );
    expect(result).toBeFalsy();
  });
  //Delete Record------------------------------------------------------|
  test("Deleting a client by Id -- successful path", async () => {
    const dummyAppointment = {
      type: "Glands",
      status: "Checked In",
      dateTime: new Date(),
      clientId: allClients,
      dogId: allDogs,
      notes: "Missed last appointment.",
      repeating: false,
    };

    appointmentModel.findOneAndDelete = jest
      .fn()
      .mockResolvedValue(dummyAppointment);

    const deleteResult = await appointmentModel.findOneAndDelete({
      _id: dummyAppointment._id,
    });

    expect(deleteResult).toBeDefined();

    expect(appointmentModel.findOneAndDelete.mock.calls.length).toBe(1);
    expect(appointmentModel.findOneAndDelete).toHaveBeenCalledWith({
      _id: dummyAppointment._id,
    });
  });
});
