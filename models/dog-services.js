const DogSchema = require('./dog');
const dbConnection = require('./dbConnection');
const clientServices = require('./client-services');
let dbC;

async function getDogs() {
  dbC = dbConnection.getDbConnection();
  const dogModel = dbC.model('Dog', DogSchema);
  let formattedResult = await formatDogs(await dogModel.find().lean());
  return formattedResult;
}

async function addDog(dog) {
  dbC = dbConnection.getDbConnection();
  const dogModel = dbC.model('Dog', DogSchema);
  try {
    const dogToAdd = new dogModel(dog);
    const saveddog = await dogToAdd.save()
    return saveddog;
  }catch (error) {
    console.log(error);
    return false;
  }
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
    //Change Client Id to name
    dogsConv = await Promise.all(dogs.map(async (dog) => {
      let client = await clientServices.getClientById(dog.clientId);
      delete dog.clientId;
      dog['clientName'] = client.firstName + " " + client.lastName;
      return dog;      
    }));
  }
  return dogsConv;
}

exports.getDogs = getDogs;
exports.addDog = addDog;
exports.getDogById = getDogById;
exports.deleteDogById = deleteDogById;