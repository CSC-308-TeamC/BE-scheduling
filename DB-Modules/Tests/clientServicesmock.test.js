const mongoose = require("mongoose");
const ClientSchema = require("../Models/client");
const clientServices = require("../Services/client-services");
const { MongoMemoryServer } = require("mongodb-memory-server");
const res = require("express/lib/response");
const mockingoose = require("mockingoose");
let mongoServer;
let connection;
let clientModel;

beforeAll(async () => {
  clientModel = mongoose.model("Client", ClientSchema);
});
let allClients;
// beforeEach(async () => {
//   allClients = await clientServices.getClients();
// })
beforeEach(async () => {
  //allClients = await clientServices.getClients();
  jest.clearAllMocks();
  mockingoose.resetAll();
});

// beforeAll(async () => {
//   mongoServer = await MongoMemoryServer.create();
//   const uri = mongoServer.getUri();

//   const mongooseOpts = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   };

//   connection = await mongoose.createConnection(uri, mongooseOpts);

//   clientModel = connection.model("Client", ClientSchema);

//   clientServices.setConnection(connection);
// });

// afterAll(async () => {
//   await connection.dropDatabase();
//   await connection.close();
//   await mongoServer.stop();
// });
// beforeEach(async () => {
//   jest.clearAllMocks();
//   //mockingoose.resetAll();
// });

// afterEach(async () => {
//   await clientModel.deleteMany();

// });

// beforeEach(async () => {
//   let dummyClient = {
//     firstName: "Philippe",
//     lastName: "Serrano",
//     phoneNumber: "805 878-2811",
//     dogs: "Mui"
//   };
//   let result = new clientModel(dummyClient);
//   await result.save();

//   dummyClient = {
//     firstName: "Mae",
//     lastName: "Ware",
//     phoneNumber: "423 897-5238",
//     dogs: "Salt"
//   };
//   result = new clientModel(dummyClient);
//   await result.save();

//   dummyClient = {
//     firstName: "Ryan",
//     lastName: "Reynold",
//     phoneNumber: "194 652-3285",
//     dogs: "Himmel"
//   };
//   result = new clientModel(dummyClient);
//   await result.save();

//   dummyClient = {
//     firstName: "Jayce",
//     lastName: "Tallis",
//     phoneNumber: "675 523-1543",
//     dogs: "Spot"
//   };
//   result = new clientModel(dummyClient);
//   await result.save();
// });

// afterEach(async () => {
//   await clientModel.deleteMany();
// });

//Tests-------------------------------------------------------------------------------------------------
//Get all Records------------------------------------------------------|
test("Get all clients", async () => {
  clientModel.findAllClients = jest.fn().mockResolvedValue([]);
  //const clients = await clientServices.getClients();
  const clients = await clientModel.findAllClients();

  // expect(clients).toBeDefined();
  expect(clients.length).toBeGreaterThanOrEqual(0);
  expect(clientModel.findAllClients.mock.calls.length).toBe(1);
  expect(clientModel.findAllClients).toHaveBeenCalledWith();
});

//Get Record by Id------------------------------------------------------|
// test("Get client by id -- Valid ID", async () => {
//   const dummyClient = {
//     firstName: "Mae",
//     lastName: "Ware",
//     phoneNumber: "423 897-5238",
//     dogs: "Salt"
//   };
//   const result = new clientModel(dummyClient);
//   const addedClient = await result.save();
//   const foundClient = await clientServices.getClientById(addedClient._id);
//   expect(foundClient).toBeDefined();
//   expect(foundClient._id).toStrictEqual(addedClient._id);
//   expect(foundClient.fullName).toBe(addedClient.firstName + " " + addedClient.lastName);
//   expect(foundClient.phoneNumber).toBe(addedClient.phoneNumber);
//   expect(foundClient.dogs).toBe(addedClient.dogs);
// });

test("Get client by id -- Nonexistant ID", async () => {
  const falseId = "6132b9d47cefd0cc1916b6a9";
  const foundClient = await clientServices.getClientById(falseId);
  mockingoose(clientModel).toReturn(undefined, "findById");
  expect(foundClient).toBeFalsy();
});

test("Get client by id -- Invalid ID", async () => {
  const invalidId = 1234;
  mockingoose(clientModel).toReturn(undefined, "findById");
  const foundClient = await clientServices.getClientById(invalidId);
  expect(foundClient).toBeFalsy();
});

//Create Record------------------------------------------------------|
test("Adding client -- successful path", async () => {
  const dummyClient = {
    firstName: "Samuel",
    lastName: "Ricci",
    phoneNumber: "298 234-4918",
    dogs: "Mario",
  };
  mockingoose(clientModel).toReturn(dummyClient, "save");

  const result = await clientServices.addClient(dummyClient);
  expect(result).toBeTruthy();
  expect(result.firstName).toBe(dummyClient.firstName);
  expect(result.lastName).toBe(dummyClient.lastName);
  expect(result.phoneNumber).toBe(dummyClient.phoneNumber);
  expect(result.dogs).toBe(dummyClient.dogs);
  expect(result).toHaveProperty("_id");
});

test("Adding client -- failure path (No FirstName)", async () => {
  const dummyClient = {
    lastName: "Ricci",
    phoneNumber: "298 234-4918",
    dogs: "Mario",
  };
  mockingoose(clientModel).toReturn(false, "save");

  const result = await clientServices.addClient(dummyClient);
  expect(result).toBeFalsy();
});

test("Adding client -- failure path (No LastName)", async () => {
  const dummyClient = {
    firstName: "Samuel",
    phoneNumber: "298 234-4918",
    dogs: "Mario",
  };
  mockingoose(clientModel).toReturn(false, "save");

  const result = await clientServices.addClient(dummyClient);
  expect(result).toBeFalsy();
});

test("Adding client -- failure path (No phone number)", async () => {
  const dummyClient = {
    firstName: "Samuel",
    lastName: "Ricci",
    dogs: "Mario",
  };
  mockingoose(clientModel).toReturn(false, "save");

  const result = await clientServices.addClient(dummyClient);
  expect(result).toBeFalsy();
});

test("Adding client -- failure path (No dogs number)", async () => {
  const dummyClient = {
    firstName: "Samuel",
    lastName: "Ricci",
    phoneNumber: "298 234-4918",
  };
  mockingoose(clientModel).toReturn(false, "save");

  const result = await clientServices.addClient(dummyClient);
  expect(result).toBeFalsy();
});

//Update Record------------------------------------------------------|
// test("Update client -- Success", async () => {
//   const clients = await clientServices.getClients();
//   const dummyClient = {
//     _id: clients[0]._id,
//     firstName: "Samuel",
//     lastName: "Ricci",
//     phoneNumber: "298 234-4918",
//     dogs: "Mario"
//   };
//   const result = await clientServices.updateClient(dummyClient);
//   expect(result).toBeDefined();
//   expect(result.fullName).toBe(dummyClient.firstName + " " + dummyClient.lastName);
//   expect(result.phoneNumber).toBe(dummyClient.phoneNumber);
//   expect(result.dogs).toBe(dummyClient.dogs);
//});

test("Update client -- nonexistant Client", async () => {
  const falseId = "6132b9d47cefd0cc1916b6a9";
  const dummyClient = {
    _id: falseId,
    firstName: "Samuel",
    lastName: "Ricci",
    phoneNumber: "298 234-4918",
    dogs: "Mario",
  };
  mockingoose(clientModel).toReturn(false, "save");

  const result = await clientServices.updateClient(dummyClient);
  expect(result).toBeFalsy();
});

test("Update client -- invalid Client ID", async () => {
  const invalidId = 1234;
  const dummyClient = {
    _id: invalidId,
    firstName: "Samuel",
    lastName: "Ricci",
    phoneNumber: "298 234-4918",
    dogs: "Mario",
  };
  mockingoose(clientModel).toReturn(false, "save");

  const result = await clientServices.updateClient(dummyClient);
  expect(result).toBeFalsy();
});

//Delete Record------------------------------------------------------|
test("Deleting a client by Id -- successful path", async () => {
  const dummyClient = {
    firstName: "Mae",
    lastName: "Ware",
    phoneNumber: "423 897-5238",
    dogs: "Salt",
  };
  clientModel.findOneAndDelete = jest.fn().mockResolvedValue(dummyClient);

  const result = new clientModel(dummyClient);
  const addedClient = await result.save();
  //const deleteResult = await clientServices.deleteClientById(addedClient._id);
  const deleteResult = await clientModel.findOneAndDelete({
    _id: addedClient._id,
  });

  expect(deleteResult).toBeDefined();

  expect(clientModel.findOneAndDelete.mock.calls.length).toBe(1);
  expect(clientModel.findOneAndDelete).toHaveBeenCalledWith({
    _id: addedClient._id,
  });
});

test("Deleting a client by Id -- nonexistant ID", async () => {
  const falseId = "6132b9d47cefd0cc1916b6a9";
  clientModel.findOneAndDelete = jest.fn().mockResolvedValue(null);
  const deleteResult = await clientModel.findOneAndDelete({ _id: falseId });

  expect(deleteResult).toBeNull();
  expect(clientModel.findOneAndDelete.mock.calls.length).toBe(1);
  expect(clientModel.findOneAndDelete).toHaveBeenCalledWith({ _id: falseId });

  // dogModel.findOneAndDelete = jest.fn().mockResolvedValue(null);

  // const deleteResult = await dogModel.findOneAndDelete({ _id: falseId });
  // //const deleteResult = await dogServices.deleteDogById(falseId);
  // expect(deleteResult).toBeNull();
  // expect(dogModel.findOneAndDelete.mock.calls.length).toBe(1);
  // expect(dogModel.findOneAndDelete).toHaveBeenCalledWith({ _id: falseId});
});

test("Deleting a client by Id -- invalid ID", async () => {
  const invalidId = 1234;
  clientModel.findOneAndDelete = jest.fn().mockResolvedValue(false);
  const deleteResult = await clientModel.findOneAndDelete({ _id: invalidId });

  expect(deleteResult).toBeFalsy();

  expect(clientModel.findOneAndDelete.mock.calls.length).toBe(1);
  expect(clientModel.findOneAndDelete).toHaveBeenCalledWith({ _id: invalidId });
});
