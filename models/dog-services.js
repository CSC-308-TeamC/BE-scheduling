const mongoose = require('mongoose');
const DogSchema = require('./dog');
const dbConnection = require('./dbConnection');
let dbC = dbConnection.getDbConnection();

  async function getDogs(){
      const dogModel = dbC.model('Dog', DogSchema);
      let testDog = [{name: 'Test DogName', breed:'Test Breed', clientId: 'Test clientId'}];
      
      let result = await dogModel.find();
      return testDog;
  }

  exports.getDogs = getDogs;