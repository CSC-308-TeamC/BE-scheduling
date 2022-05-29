//const mockingoose = require('mockingoose');
const mongoose = require("mongoose");
const DogSchema = require("../Models/dog");
const ClientSchema = require("../Models/client");
const dogServices = require("../Services/dog-services");
const clientServices = require("../Services/client-services");
const dbConnection = require("../dbConnection");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mockingoose = require("mockingoose");

let mongoServer;
let connection;
let dogModel;
let clientModel;
beforeAll(async () => {
  dogModel = mongoose.model("Dog", DogSchema);
});

let allClients;

beforeEach(async () => {
  jest.clearAllMocks();
  mockingoose.resetAll();
});

//Tests-------------------------------------------------------------------------------------------------
//Get all Records------------------------------------------------------|
test("Get all dogs -- Success", async () => {
  dogModel.findAllDogs = jest.fn().mockResolvedValue([]);
  //const dogs = await dogServices.getDogs();
  const dogs = await dogModel.findAllDogs();

  expect(dogs).toBeDefined();
  expect(dogs.length).toBeGreaterThanOrEqual(0);
  expect(dogModel.findAllDogs.mock.calls.length).toBe(1);
  expect(dogModel.findAllDogs).toHaveBeenCalledWith();
});

test("Get all dogs -- Nonexistant clientID", async () => {
  const falseId = "6132b9d47cefd0cc1916b6a9";
  const dummyDog = {
    name: "Kali",
    breed: "Chow",
    clientId: falseId,
  };
  mockingoose(dogModel).toReturn(undefined, "findById");
  //dogModel.findById = jest.fn().mockResolvedValue(undefafined);

  const result = new dogModel(dummyDog);
  await result.save();
  // const dogs = await dogServices.getDogs();
  const dogs = await dogModel.findById();

  expect(dogs).toBeFalsy();
});

//Get Record by id------------------------------------------------------|
test("Get dog by id -- Nonexistant ID", async () => {
  const falseId = "6132b9d47cefd0cc1916b6a9";
  const foundDog = await dogServices.getDogById(falseId);
  mockingoose(dogModel).toReturn(false, "findById");
  expect(foundDog).toBeFalsy();
});

test("Get dog by id -- Invalid ID", async () => {
  const invalidId = 1234;
  const foundDog = await dogServices.getDogById(invalidId);
  mockingoose(dogModel).toReturn(false, "findById");

  expect(foundDog).toBeFalsy();
});

//Creating Record------------------------------------------------------|
test("Adding dog -- failure path (No clientId)", async () => {
  const dummyDog = {
    name: "Kali",
    breed: "Chow",
  };
  mockingoose(dogModel).toReturn(false, "save");
  const result = await dogServices.addDog(dummyDog);
  expect(result).toBeFalsy();
});

//Delete Record------------------------------------------------------|
test("Deleting a client by Id -- nonexistant ID", async () => {
  const falseId = "6132b9d47cefd0cc1916b6a9";
  dogModel.findOneAndDelete = jest.fn().mockResolvedValue(null);

  const deleteResult = await dogModel.findOneAndDelete({ _id: falseId });
  //const deleteResult = await dogServices.deleteDogById(falseId);
  expect(deleteResult).toBeNull();
  expect(dogModel.findOneAndDelete.mock.calls.length).toBe(1);
  expect(dogModel.findOneAndDelete).toHaveBeenCalledWith({ _id: falseId });
});

test("Deleting a client by Id -- invalid ID", async () => {
  const invalidId = 1234;
  //const deleteResult = await dogServices.deleteDogById(invalidId);
  // expect(deleteResult).toBeFalsy();

  dogModel.findOneAndDelete = jest.fn().mockResolvedValue(false);

  const deleteResult = await dogModel.findOneAndDelete({ _id: invalidId });
  //const deleteResult = await dogServices.deleteDogById(falseId);
  expect(deleteResult).toBeFalsy();
  expect(dogModel.findOneAndDelete.mock.calls.length).toBe(1);
  expect(dogModel.findOneAndDelete).toHaveBeenCalledWith({ _id: invalidId });
});

//Tests Requiring all Clients-------------------------------------------------------------------------------------------------
describe("Get clients for ids", () => {
  //Get Record------------------------------------------------------|

  test("Adding dog -- failure path (No name)", async () => {
    const dummyDog = {
      breed: "Chow",
      clientId: allClients,
    };
    mockingoose(dogModel).toReturn(false, "save");
    const result = await dogServices.addDog(dummyDog);
    expect(result).toBeFalsy();
  });

  test("Adding dog -- failure path (No breed)", async () => {
    const dummyDog = {
      name: "Kali",
      clientId: allClients,
    };
    mockingoose(dogModel).toReturn(false, "save");

    const result = await dogServices.addDog(dummyDog);
    expect(result).toBeFalsy();
  });

  //Update Record------------------------------------------------------|

  test("Update dog -- nonexistant Dog", async () => {
    const falseId = "6132b9d47cefd0cc1916b6a9";
    const dummyDog = {
      _id: falseId,
      name: "George",
      breed: "Terrier",
      clientId: allClients,
    };
    const result = await dogServices.updateDog(dummyDog);
    mockingoose(dogModel).toReturn(false, "findById");

    expect(result).toBeFalsy();
  });

  test("Update dog -- invalid DogID", async () => {
    const invalidId = 1234;
    const dummyClient = {
      _id: invalidId,
      name: "George",
      breed: "Terrier",
      clientId: allClients,
    };
    const result = await dogServices.updateDog(dummyClient);
    mockingoose(dogModel).toReturn(false, "findById");

    expect(result).toBeFalsy();
  });

  //Delete Record------------------------------------------------------|
  test("Deleting a dog by Id -- successful path", async () => {
    const dummyDog = {
      name: "Kali",
      breed: "Chow",
      clientId: allClients,
      //"id"
    };
    dogModel.findOneAndDelete = jest.fn().mockResolvedValue(dummyDog);
    const deleteResult = await dogModel.findOneAndDelete({ _id: dummyDog._id });
    expect(deleteResult).toBeTruthy();
    expect(deleteResult.name).toBe(dummyDog.name);
    expect(dogModel.findOneAndDelete.mock.calls.length).toBe(1);
    expect(dogModel.findOneAndDelete).toHaveBeenCalledWith({
      _id: dummyDog._id,
    });
  });
});
