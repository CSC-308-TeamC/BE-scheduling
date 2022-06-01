const mongoose = require("mongoose");
const UserSchema = require("../Models/user");
const userServices = require("../Services/user-services");
const { MongoMemoryServer } = require("mongodb-memory-server");
const res = require("express/lib/response");

let mongoServer;
let connection;
let userModel;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  connection = await mongoose.createConnection(uri, mongooseOpts);

  userModel = connection.model("User", UserSchema);

  userServices.setConnection(connection);
});

afterAll(async () => {
  await connection.dropDatabase();
  await connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  let dummyUser = {
    email: "testPerson1@email.com",
    password: "testPerson1Password",
    administrator: false,
  };
  let result = new userModel(dummyUser);
  await result.save();

  dummyUser = {
    email: "testPerson2@email.com",
    password: "testPerson2Password",
    administrator: false,
  };
  result = new userModel(dummyUser);
  await result.save();

  dummyUser = {
    email: "testPerson3@email.com",
    password: "testPerson3Password",
    administrator: true,
  };
  result = new userModel(dummyUser);
  await result.save();

  dummyUser = {
    email: "testPerson4@email.com",
    password: "testPerson4Password",
    administrator: true,
  };
  result = new userModel(dummyUser);
  await result.save();
});

afterEach(async () => {
  await userModel.deleteMany();
});

//Tests-------------------------------------------------------------------------------------------------
//Get all Records------------------------------------------------------|
test("Get all users", async () => {
  const users = await userServices.getUsers();
  expect(users).toBeDefined();
  expect(users.length).toBeGreaterThan(0);
});

//Get Record by Id------------------------------------------------------|
test("Get user by email -- Valid email", async () => {
  const dummyUser = {
    email: "testPerson5@email.com",
    password: "testPerson5Password",
    administrator: false,
  };
  const result = new userModel(dummyUser);
  const addedUser = await result.save();
  const foundUser = await userServices.getUserByEmail(addedUser.email);
  expect(foundUser).toBeDefined();
  expect(foundUser.email).toBe(addedUser.email);
});

test("Get user by email -- Nonexistant Email", async () => {
  const falseEmail = "testPerson-1@email.com";
  const foundUser = await userServices.getUserByEmail(falseEmail);
  expect(foundUser).toBeFalsy();
});

test("Get client by email -- Invalid Email", async () => {
  const invalidEmail = -1;
  const foundUser = await userServices.getUserByEmail(invalidEmail);
  expect(foundUser).toBeFalsy();
});

//Create Record------------------------------------------------------|
test("Adding user -- successful path", async () => {
  const dummyUser = {
    email: "testPerson5@email.com",
    password: "testPerson5Password",
    administrator: false,
  };
  const result = await userServices.addUser(dummyUser);
  expect(result).toBeTruthy();
  expect(result.email).toBe(dummyUser.email);
  expect(result).toHaveProperty("password");
});

test("Adding user -- failure path (No Email)", async () => {
  const dummyUser = {
    password: "testPerson5Password",
    administrator: false,
  };
  const result = await userServices.addUser(dummyUser);
  expect(result).toBeFalsy();
});

test("Adding user -- failure path (No Password)", async () => {
  const dummyUser = {
    email: "testPerson5@email.com",
    administrator: false,
  };
  const result = await userServices.addUser(dummyUser);
  expect(result).toBeFalsy();
});

test("Adding user -- failure path (No Password)", async () => {
  const dummyUser = {
    email: "testPerson5@email.com",
    password: "testPerson5Password",
  };
  const result = await userServices.addUser(dummyUser);
  expect(result).toBeFalsy();
});

// //Update Record------------------------------------------------------|
// test("Update user -- Success", async () => {
//   const dummyUser = {
//     email: "testPerson1@email.com",
//     password: "testPerson1Password",
//     administrator: true,
//   };
//   const result = await userServices.updateUser(dummyUser);
//   expect(result).toBeDefined();
//   expect(result.email).toBe(dummyUser.email);
// });

// test("Update user -- nonexistant User", async () => {
//   const dummyClient = {
//     firstName: "Samuel",
//     lastName: "Ricci",
//     phoneNumber: "298 234-4918",
//     dogs: "Mario",
//   };
//   const result = await userServices.updateClient(dummyClient);
//   expect(result).toBeFalsy();
// });

// test("Update client -- invalid Client ID", async () => {
//   const invalidId = 1234;
//   const dummyClient = {
//     _id: invalidId,
//     firstName: "Samuel",
//     lastName: "Ricci",
//     phoneNumber: "298 234-4918",
//     dogs: "Mario",
//   };
//   const result = await userServices.updateClient(dummyClient);
//   expect(result).toBeFalsy();
// });

//Delete Record------------------------------------------------------|
test("Deleting a user by email -- successful path", async () => {
  const dummyUser = {
    email: "testPerson5@email.com",
    password: "testPerson5Password",
    administrator: false,
  };
  const result = new userModel(dummyUser);
  const addedUser = await result.save();
  const deleteResult = await userServices.deleteUserByEmail(addedUser.email);
  expect(deleteResult).toBeDefined();
});

test("Deleting a user by email -- nonexistant email", async () => {
  const falseEmail = "testPerson-1@email.com";
  const deleteResult = await userServices.deleteUserByEmail(falseEmail);
  expect(deleteResult).toStrictEqual({ acknowledged: true, deletedCount: 0 });
});

test("Deleting a user by email -- invalid email", async () => {
  const invalidEmail = -1;
  const deleteResult = await userServices.deleteUserByEmail(invalidEmail);
  expect(deleteResult).toStrictEqual({ acknowledged: true, deletedCount: 0 });
});
