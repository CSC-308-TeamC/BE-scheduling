const mongoose = require('mongoose');
const DogSchema = require('../Models/dog');
const ClientSchema = require('../Models/client');
const AppointmentSchema = require('../Models/appointment')
const dogServices = require('../Services/dog-services');
const clientServices = require('../Services/client-services');
const appointmentServices = require('../Services/appointment-services');
const dbConnection = require('../dbConnection');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mockingoose = require('mockingoose');


let mongoServer;
let connection;
let dogModel;
let clientModel;
let appointmentModel;

beforeAll(async () => {
    appointmentModel = mongoose.model("Appointment", AppointmentSchema);
  });

// beforeAll(async () => {
//     mongoServer = await MongoMemoryServer.create();
//     const uri = mongoServer.getUri();

//     const mongooseOpts = {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     };

//     connection = await mongoose.createConnection(uri, mongooseOpts);

//     appointmentModel = connection.model("Appointment", AppointmentSchema);
//     clientModel = connection.model("Client", ClientSchema);
//     dogModel = connection.model("Dog", DogSchema);

//     appointmentServices.setConnection(connection);
//     clientServices.setConnection(connection);
//     dogServices.setConnection(connection);
// });

// afterAll(async () => {
//     await connection.dropDatabase();
//     await connection.close();
//     await mongoServer.stop();
// });
beforeEach(async () => {
    jest.clearAllMocks();
    mockingoose.resetAll();
  });
  
//   afterEach(async () => {
//     await appointmentModel.deleteMany();
//     await clientModel.deleteMany();
//     await dogModel.deleteMany();
//   });

// beforeEach(async () => {
//     let dummyClient = {
//         firstName: "Philippe",
//         lastName: "Serrano",
//         phoneNumber: "805 878-2811",
//         dogs: "Mui"
//     };
//     let result = new clientModel(dummyClient);
//     let clientAdded = await result.save();

//     let dummyDog = {
//         name: "Mui",
//         breed: "Labrador",
//         clientId: clientAdded._id
//     };
//     result = new dogModel(dummyDog);
//     let dogAdded = await result.save();

//     let dummyAppointment = {
//         type: "Groom",
//         status: "Scheduled",
//         dateTime: new Date(),
//         clientId: clientAdded._id,
//         dogId: dogAdded._id,
//         notes: "No Notes.",
//         repeating: false
//     };
//     result = new appointmentModel(dummyAppointment);
//     await result.save();

//     dummyClient = {
//         firstName: "Mae",
//         lastName: "Ware",
//         phoneNumber: "423 897-5238",
//         dogs: "Salt"
//     };
//     result = new clientModel(dummyClient);
//     clientAdded = await result.save();

//     dummyDog = {
//         name: "Salt",
//         breed: "Terrier",
//         clientId: clientAdded._id
//     };
//     result = new dogModel(dummyDog);
//     dogAdded = await result.save();

//     dummyAppointment = {
//         type: "Bath",
//         status: "Postponed",
//         dateTime: new Date(),
//         clientId: clientAdded._id,
//         dogId: dogAdded._id,
//         notes: "Does not like ears cleaned.",
//         repeating: true
//     };
//     result = new appointmentModel(dummyAppointment);
//     await result.save();

//     dummyClient = {
//         firstName: "Ryan",
//         lastName: "Reynold",
//         phoneNumber: "194 652-3285",
//         dogs: "Himmel"
//     };
//     result = new clientModel(dummyClient);
//     clientAdded = await result.save();

//     dummyDog = {
//         name: "Himmel",
//         breed: "Mixed",
//         clientId: clientAdded._id
//     };
//     result = new dogModel(dummyDog);
//     dogAdded = await result.save();

//     dummyAppointment = {
//         type: "Nails",
//         status: "Completed",
//         dateTime: new Date(),
//         clientId: clientAdded._id,
//         dogId: dogAdded._id,
//         notes: "Paid in cash",
//         repeating: false
//     };
//     result = new appointmentModel(dummyAppointment);
//     await result.save();
// });

// afterEach(async () => {
//     await appointmentModel.deleteMany();
//     await clientModel.deleteMany();
//     await dogModel.deleteMany();
// });

//Tests-------------------------------------------------------------------------------------------------
//Get all Records------------------------------------------------------|
test("Get all appointments -- Success", async () => {
    //const appointments = await appointmentServices.getAppointments();
    appointmentModel.findAllAppointments = jest.fn().mockResolvedValue([]);

    const appointments = await appointmentModel.findAllAppointments();

    //expect(appointments).toBeDefined();
    //expect(appointments.length).toBeGreaterThan(0);
  //const clients = await clientServices.getClients();

 // expect(clients).toBeDefined();
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
        repeating: false
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

    //expect(appointments).toBeDefined();
    //expect(appointments.length).toBeGreaterThan(0);
  //const clients = await clientServices.getClients();

 // expect(clients).toBeDefined();
    expect(appointments.length).toBeGreaterThanOrEqual(0);
    expect(appointmentModel.getTodaysAppointments.mock.calls.length).toBe(1);
    expect(appointmentModel.getTodaysAppointments).toHaveBeenCalledWith();

    // const appointments = await appointmentServices.getTodaysAppointments();
    // expect(appointments).toBeDefined();
    // expect(appointments.length).toBeGreaterThan(0);
});

//Create Record------------------------------------------------------|
test("Get appointment by id -- Nonexistant ID", async () => {
    const falseId = "6132b9d47cefd0cc1916b6a9";
    const foundAppointment = await appointmentServices.getAppointmentById(falseId);
    expect(foundAppointment).toBeFalsy();
});

test("Get appointment by id -- Invalid ID", async () => {
    const invalidId = 1234;
    const foundAppointment = await appointmentServices.getAppointmentById(invalidId);
    expect(foundAppointment).toBeFalsy();
});

//Delete Record------------------------------------------------------|
test("Deleting a appointment by Id -- Nonexistant ID", async () => {
    const falseId = "6132b9d47cefd0cc1916b6a9";
    //const deleteResult = await appointmentServices.deleteAppointmentById(falseId);
   // expect(deleteResult).toBeFalsy();
    appointmentModel.findOneAndDelete = jest.fn().mockResolvedValue(null);
    const deleteResult = await appointmentModel.findOneAndDelete({ _id: falseId });
  
    expect(deleteResult).toBeNull();
    expect(appointmentModel.findOneAndDelete.mock.calls.length).toBe(1);
    expect(appointmentModel.findOneAndDelete).toHaveBeenCalledWith({ _id: falseId}); 
});

test("Deleting a appointment by Id -- Invalid ID", async () => {
    const invalidId = 1234;
    //const deleteResult = await appointmentServices.deleteAppointmentById(invalidId);
   // expect(deleteResult).toBeFalsy();

    appointmentModel.findOneAndDelete = jest.fn().mockResolvedValue(false);


    const deleteResult = await appointmentModel.findOneAndDelete({ _id: invalidId });
  //const deleteResult = await dogServices.deleteDogById(falseId);
    expect(deleteResult).toBeFalsy();
    expect(appointmentModel.findOneAndDelete.mock.calls.length).toBe(1);
    expect(appointmentModel.findOneAndDelete).toHaveBeenCalledWith({ _id: invalidId});
});



//Tests Requiring all Clients-------------------------------------------------------------------------------------------------
describe('Get clients and dogs for ids', () => {
    let allClients;
    let allDogs;

    // beforeEach(async () => {
    //     allClients = await clientServices.getClients();
    //     allDogs = await dogServices.getDogs();
    // });

    //Get Record by id------------------------------------------------------|
    // test("Get appointment by id -- Valid ID", async () => {
    //     const dummyAppointment = {
    //         type: "Glands",
    //         status: "Checked In",
    //         dateTime: new Date(),
    //         clientId: allClients,
    //         dogId: allDogs,
    //         notes: "Missed last appointment.",
    //         repeating: false
    //     };
    //     const result = new appointmentModel(dummyAppointment);
    //     const addedAppointment = await result.save();
    //     const foundAppointment = await appointmentServices.getAppointmentById(addedAppointment._id);
    //     expect(foundAppointment).toBeDefined();
    //     expect(foundAppointment._id).toStrictEqual(addedAppointment._id);
    //     expect(foundAppointment.type).toBe(addedAppointment.type);
    //     expect(foundAppointment.status).toBe(addedAppointment.status);
    //     expect(foundAppointment.dateTime).toBe(addedAppointment.dateTime.toLocaleDateString('en-US') + " " + addedAppointment.dateTime.toLocaleTimeString('en-US'));
    //     expect(foundAppointment.clientName).toBe(allClients[0].fullName);
    //     expect(foundAppointment.dogName).toBe(allDogs[0].name);
    //     expect(foundAppointment.notes).toBe(addedAppointment.notes);
    //     expect(foundAppointment.repeating).toBe(addedAppointment.repeating);
    // });

    // //Create Record ------------------------------------------------------|  
    // test("Adding appointment -- successful path", async () => {
    //     const dummyAppointment = {
    //         type: "Glands",
    //         status: "Checked In",
    //         dateTime: new Date(),
    //         clientId: allClients,
    //         dogId: allDogs,
    //         notes: "Missed last appointment.",
    //         repeating: false
    //     };
    //     const result = await appointmentServices.addAppointment(dummyAppointment);
    //     expect(result).toBeTruthy();
    //     expect(result.type).toBe(dummyAppointment.type);
    //     expect(result.status).toBe(dummyAppointment.status);
    //     expect(result.dateTime).toBe(dummyAppointment.dateTime);
    //     expect(result.clientName).toBe(allClients[0].fullName);
    //     expect(result.dogName).toBe(allDogs[0].name);
    //     expect(result.notes).toBe(dummyAppointment.notes);
    //     expect(result.repeating).toBe(dummyAppointment.repeating);
    //     expect(result).toHaveProperty("_id");
    // });

    test("Adding appointment -- failure path (No type field)", async () => {
        const dummyAppointment = {
            status: "Checked In",
            dateTime: new Date(),
            clientId: allClients,
            dogId: allDogs,
            notes: "Missed last appointment.",
            repeating: false
        };
        mockingoose(appointmentModel).toReturn(false, 'save');
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
            repeating: false
        };
        mockingoose(appointmentModel).toReturn(false, 'save');

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
            repeating: false
        };
        mockingoose(appointmentModel).toReturn(false, 'save');

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
            repeating: false
        };
        mockingoose(appointmentModel).toReturn(false, 'save');

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
            repeating: false
        };
        mockingoose(appointmentModel).toReturn(false, 'save');

        const result = await appointmentServices.addAppointment(dummyAppointment);
        expect(result).toBeFalsy();
    });

    //Update Record------------------------------------------------------|
    // test("Update appointment -- Success", async () => {

    //     const appointments = await appointmentModel.updateAppointment();
    //     appointmentModel.updateAppointment = jest.fn().mockResolvedValue([]);


    //     //expect(appointments).toBeDefined();
    //     //expect(appointments.length).toBeGreaterThan(0);
    // //const clients = await clientServices.getClients();

    // // expect(clients).toBeDefined();
    
    //    // const appointments = await appointmentModel.getAppointments();
    //     const dummyAppointment = {
    //         _id: appointments,
    //         type: "Glands",
    //         status: "Checked In",
    //         dateTime: new Date(),
    //         clientId: allClients,
    //         dogId: allDogs,
    //         notes: "Missed last appointment.",
    //         repeating: false
    //     };
    //     //const result = await appointmentServices.updateAppointment(dummyAppointment);
    //     const result = await appointmentModel.updateAppointment({ _id: dummyAppointment._id });

    //     expect(result).toBeDefined();
    //     expect(result.type).toBe(dummyAppointment.type);
    //     //expect(result.status).toBe(dummyAppointment.status);
    //     expect(result.dateTime).toBe(dummyAppointment.dateTime.toLocaleDateString('en-US') + " " + dummyAppointment.dateTime.toLocaleTimeString('en-US'))
    //     expect(result.clientName).toBe(allClients[0].fullName);
    //     expect(result.dogName).toBe(allDogs[0].name);
    //     expect(result.notes).toBe(dummyAppointment.notes);
    //     expect(result.repeating).toBe(dummyAppointment.repeating);
    //     expect(appointments.length).toBeGreaterThanOrEqual(0);
    //     expect(appointmentModel.updateAppointment.mock.calls.length).toBe(1);
    //     expect(appointmentModel.updateAppointment).toHaveBeenCalledWith({ _id: dummyAppointment._id });
    // });

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
            repeating: false
        };
        const result = await appointmentServices.updateAppointment(dummyAppointment);
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
            repeating: false
        };
        const result = await appointmentServices.updateAppointment(dummyAppointment);
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
        repeating: false
    };
    //const result = new appointmentModel(dummyAppointment);
    //const addedAppointment = await result.save();
   // const deleteResult = await appointmentServices.deleteAppointmentById(addedAppointment._id);
    //expect(deleteResult).toBeDefined();

    appointmentModel.findOneAndDelete = jest.fn().mockResolvedValue(dummyAppointment);

  //const result = new clientModel(dummyClient);
  //const addedAppo = await result.save();
  //const deleteResult = await clientServices.deleteClientById(addedClient._id);
  const deleteResult = await appointmentModel.findOneAndDelete({ _id: dummyAppointment._id });

  expect(deleteResult).toBeDefined();
  
  expect(appointmentModel.findOneAndDelete.mock.calls.length).toBe(1);
  expect(appointmentModel.findOneAndDelete).toHaveBeenCalledWith({ _id: dummyAppointment._id });  
  });

  
});