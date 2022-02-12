const DogSchema = require('./dog');
const dbConnection = require('./dbConnection');
const res = require('express/lib/response');
let dbC;

async function getDogs() {
  dbC = dbConnection.getDbConnection();
  const dogModel = dbC.model('Dog', DogSchema);
  let testDog = [{ name: 'Test DogName', breed: 'Test Breed', dogId: 'Test clientId' }];
  let result = await dogModel.find();
  return result;
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

exports.getDogs = getDogs;
exports.addDog = addDog;
exports.deleteDogById = deleteDogById;