const DogSchema = require('../Models/dog');
const dbConnection = require('../dbConnection');
const clientServices = require('./client-services');
let dbC;

async function getDogs() {
  dbC = dbConnection.getDbConnection();
  const dogModel = dbC.model('Dog', DogSchema);
  let formattedResult = await formatDogs(await dogModel.find().lean());
  return formattedResult;
}


async function getDogById(id) {
  dbC = dbConnection.getDbConnection();
  const dogModel = dbC.model('Dog', DogSchema);
  try {
    let result = await dogModel.findById(id);
    return result;
  }catch (error) {
    console.log(error);
    return false;
  }
}

async function addDog(dog) {
  dbC = dbConnection.getDbConnection();
  const dogModel = dbC.model('Dog', DogSchema);
  try {
    const dogToAdd = new dogModel(dog);
    var savedDog = await dogToAdd.save();

    await formatDog(dog);
    dog._id = savedDog._id; 

    return dog;
  }catch (error) {
    console.log(error);
    return false;
  }
}

async function updateDog(dog){
  dbC = dbConnection.getDbConnection();
  const dogModel = dbC.model('Dog', DogSchema);
  try{
    let updatedDog = await dogModel.findOneAndUpdate({_id: dog._id}, 
      {
        "name": dog.name,
        "breed": dog.breed,
        "clientId": dog.clientId
      }, 
      {returnNewDocument: true}).lean();
    await formatDog(updatedDog);
    return updatedDog;
  }catch(error){
    console.log(error);
    return false;
  }
}

async function deleteDogById(id) {
  dbC = dbConnection.getDbConnection();
  const dogModel = dbC.model('Dog', DogSchema);
  try {
    return await dogModel.findByIdAndRemove(id);
  }catch (error) {
    console.log(error);
    return false;
  }
}


async function formatDogs(dogs){
  let dogsConv = [];
  if(dogs.length != 0){
    dogsConv = await Promise.all(dogs.map(async (dog) => {
      return formatDog(dog);
    }));
  }
  return dogsConv;
}

async function formatDog(dog){
  if(dog){
    let client = await clientServices.getClientById(dog.clientId);
    delete dog.clientId;
    dog['clientName'] = client.firstName + " " + client.lastName;
    return dog;
  }
}

// module.exports = {
//   getDogs,
//   getDogById,
//   addDog,
//   updateDog,
//   deleteDogById
// }
exports.getDogs = getDogs;
exports.getDogById = getDogById;
exports.addDog = addDog;
exports.updateDog = updateDog;
exports.deleteDogById = deleteDogById;
