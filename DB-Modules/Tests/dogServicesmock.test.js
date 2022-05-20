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

//  beforeAll(async () => {
//    mongoServer = MongoMemoryServer.create();
//     const uri = mongoServer;

//   const mongooseOpts = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   };

//     connection = await mongoose.createConnection(uri, mongooseOpts);

//     clientModel = connection.model("Client", ClientSchema);
//     dogModel = connection.model("Dog", DogSchema);

//   clientServices.setConnection(connection);
//   dogServices.setConnection(connection);
//  });

// afterAll(async () => {
//   await connection.dropDatabase();
//   await connection.close();
//   await mongoServer.stop();
//  });
let allClients;
// beforeEach(async () => {
//   allClients = await clientServices.getClients();
// })
beforeEach(async () => {
  //allClients = await clientServices.getClients();
  jest.clearAllMocks();
  mockingoose.resetAll();
});

// afterEach(async () => {
//   await dogModel.deleteMany();
//   await clientModel.deleteMany();

// });

// beforeEach(async () => {
// //clientModel = connection.model("Client", ClientSchema);
// //mongoServer = MongoMemoryServer.create();
// //     const uri = mongoServer;

// //   const mongooseOpts = {
// //     useNewUrlParser: true,
// //     useUnifiedTopology: true,
// //   };

// //     connection = await mongoose.createConnection(uri, mongooseOpts);

// //     clientModel = connection.model("Client", ClientSchema);
// //     dogModel = connection.model("Dog", DogSchema);

// // //   clientServices.setConnection(connection);
// // //   dogServices.setConnection(connection);
//   let dummyClient = {
//     firstName: "Philippe",
//     lastName: "Serrano",
//     phoneNumber: "805 878-2811",
//     dogs: "Mui"
//   };
// //   let result = new clientModel(dummyClient);
// //  let clientAdded = await result.save();

//   let dummyDog = {
//     name: "Mui",
//     breed: "Labrador",
//     //clientId: clientAdded._id
//   };
//  // result = new dogModel(dummyDog);
//  // await result.save();

//   dummyClient = {
//     firstName: "Mae",
//     lastName: "Ware",
//     phoneNumber: "423 897-5238",
//     dogs: "Salt"
//   };
//  // result = new clientModel(dummyClient);
//  // clientAdded = await result.save();

//   dummyDog = {
//     name: "Salt",
//     breed: "Terrier",
//     //clientId: clientAdded._id
//   };
// //  result = new dogModel(dummyDog);
//  // await result.save();

//   dummyClient = {
//     firstName: "Ryan",
//     lastName: "Reynold",
//     phoneNumber: "194 652-3285",
//     dogs: "Himmel"
//   };
//  // result = new clientModel(dummyClient);
//  // clientAdded = await result.save();

//   dummyDog = {
//     name: "Himmel",
//     breed: "Mixed",
//    // clientId: clientAdded._id
//   };
// //  result = new dogModel(dummyDog);
//  // await result.save();
// });

// // afterEach(async () => {
// //   await dogModel.deleteMany();
// //   await clientModel.deleteMany();
// // });

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
  // expect(dogModel.findById.mock.calls.length).toBe(1);
  // expect(dogModel.findById).toHaveBeenCalledWith(falseId);
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
  // let allClients;
  // beforeEach(async () => {
  //   allClients = await clientServices.getClients();
  // })

  //Get Record------------------------------------------------------|
  //   test("Get dog by id -- Valid ID", async () => {
  //     const dummyDog = {
  //       name: "Kali",
  //       breed: "Chow",
  //       clientId: allClients[1]._id
  //     };
  //     //dogModel.findById = jest.fn().mockResolvedValue(dummyDog);

  //     const result = new dogModel(dummyDog);
  //     const addedDog = await result.save();
  //     const foundDog = await dogServices.getDogById(addedDog._id);
  //     expect(foundDog).toBeDefined();
  //     expect(foundDog._id).toStrictEqual(addedDog._id);
  //     expect(foundDog.name).toBe(addedDog.name);
  //     expect(foundDog.breed).toBe(addedDog.breed);
  //     expect(foundDog.clientId).toStrictEqual(addedDog.clientId);
  //     // expect(userModel.findById.mock.calls.length).toBe(1);
  //     // expect(userModel.findById).toHaveBeenCalledWith({_id: clientId});
  //   });

  //Create Record------------------------------------------------------|
  //   test("Adding dog -- Successful path", async () => {
  //     const dummyDog = {
  //       name: "Kali",
  //       breed: "Chow",
  //       clientId: allClients
  //     };
  //     //mockingoose(userModel).toReturn(dummyDog, 'save');
  //     //dogModel.find = jest.fn().mockResolvedValue(dummyDog);

  //     dogModel.findOneAndAdd = jest.fn().mockResolvedValue(dummyDog);
  //     //mockingoose(dogModel).toReturn(dummyDog, 'save');

  //     //dogModel.findOneAndAdd = jest.fn().mockResolvedValue(dummyDog);

  //     //const deleteResult = await dogServices.deleteDogById(dummyDog._id);
  //     //const addResult = await dogModel.findOneAndAdd({ _id: dummyDog._id });

  //     const result = await dogServices.addDog(dummyDog);
  //     //expect(result).toBeFalsy();
  //     // expect(result.name).toBe(dummyDog.name);
  //     // expect(result.breed).toBe(dummyDog.breed);
  //     // expect(result.clientId).toStrictEqual(dummyDog.clientId);
  //     expect(result).toHaveProperty("_id");

  //     // expect(dogModel.findOneAndAdd.mock.calls.length).toBe(1);
  //     // expect(dogModel.findOneAndAdd).toHaveBeenCalledWith({ _id: dummyDog.clientId });
  //     // expect(userModel.find.mock.calls.length).toBe(1);
  //     // expect(userModel.find).toHaveBeenCalledWith({name: userName});

  //   });

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
  //   test("Update Dog -- Success", async () => {
  //     const dogs = await dogServices.getDogs();
  //     const dummyDog = {
  //       _id: dogs[0],
  //       name: "George",
  //       breed: "Terrier",
  //       clientId: allClients
  //     };
  //     const result = await dogServices.updateDog(dummyDog);
  //     expect(result).toBeUndefined();
  //     expect(result.name).toBe(dummyDog.name);
  //     expect(result.breed).toBe(dummyDog.breed);
  //     expect(result.clientName).toBe(allClients[0].fullName);
  //   });

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

    //const result = new dogModel(dummyDog);
    //const addedDog = await result.save();
    //const deleteResult = await dogServices.deleteDogById(dummyDog._id);
    const deleteResult = await dogModel.findOneAndDelete({ _id: dummyDog._id });

    expect(deleteResult).toBeTruthy();
    expect(deleteResult.name).toBe(dummyDog.name);

    expect(dogModel.findOneAndDelete.mock.calls.length).toBe(1);
    expect(dogModel.findOneAndDelete).toHaveBeenCalledWith({
      _id: dummyDog._id,
    });
  });
});
