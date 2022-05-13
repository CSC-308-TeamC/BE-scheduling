const DogSchema = require("../Models/dog");
const dbConnection = require("../dbConnection");
const appointmentServices = require("./appointment-services");
const clientServices = require("./client-services");
const res = require("express/lib/response");
let dbC;

function setConnection(newConnection) {
  dbC = newConnection;
  return dbC;
}

async function getDogs(format = true) {
  dbC = dbConnection.getDbConnection(dbC);
  const dogModel = dbC.model("Dog", DogSchema);
  try {
    let dogResults = await dogModel.find().lean();
    if (format) {
      dogResults = await formatDogs(dogResults);
    }
    return dogResults;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getDogById(id, format = true) {
  dbC = dbConnection.getDbConnection(dbC);
  const dogModel = dbC.model("Dog", DogSchema);
  try {
    let result = await dogModel.findById(id).lean();

    if (JSON.parse(format)) result = await formatDog(result);

    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function addDog(dog) {
  dbC = dbConnection.getDbConnection(dbC);
  const dogModel = dbC.model("Dog", DogSchema);
  try {
    const dogToAdd = new dogModel(dog);
    var savedDog = await dogToAdd.save();

    await formatDog(dog);
    dog._id = savedDog._id;

    return dog;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function updateDog(dog) {
  dbC = dbConnection.getDbConnection(dbC);
  const dogModel = dbC.model("Dog", DogSchema);
  try {
    let updatedDog = await dogModel
      .findOneAndUpdate(
        { _id: dog._id },
        {
          name: dog.name,
          breed: dog.breed,
          clientId: dog.clientId,
        },
        { returnOriginal: false }
      )
      .lean();
    await formatDog(updatedDog);
    return updatedDog;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function deleteDogById(id) {
  dbC = dbConnection.getDbConnection(dbC);
  const dogModel = dbC.model("Dog", DogSchema);
  try {
    //If dog is deleted, delete all appointments it is contained within.
    let associatedAppointments = await appointmentServices.getAppointments(
      false
    );
    associatedAppointments.forEach(async (appointment) => {
      if (appointment.dogId.equals(id)) {
        await appointmentServices.deleteAppointmentById(appointment._id);
      }
    });
    return await dogModel.findByIdAndRemove(id);
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function formatDogs(dogs) {
  let dogsConv = [];
  if (dogs.length != 0) {
    dogsConv = await Promise.all(
      dogs.map(async (dog) => {
        return formatDog(dog);
      })
    );
  }
  return dogsConv;
}

async function formatDog(dog) {
  if (dog) {
    let client = await clientServices.getClientById(dog.clientId);
    delete dog.clientId;
    dog["clientName"] = client.fullName;
    return dog;
  }
}

exports.setConnection = setConnection;
exports.getDogs = getDogs;
exports.getDogById = getDogById;
exports.addDog = addDog;
exports.updateDog = updateDog;
exports.deleteDogById = deleteDogById;
