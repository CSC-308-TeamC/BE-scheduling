const mongoose = require('mongoose');
const ClientSchema = require('./dog');
import DogSchema from './dog';
import dbConnection from './models/dbConnection'
let dbConnection = dbConnection.getDbConnection();

  async function getDogs(){
      const dogModel = getDbConnection().model('Dog', DogSchema);
      let testDog = [{name: 'Test DogName', breed:'Test Breed', clientId: 'Test clientId'}];
      
      let result = await dogModel.find();
      return testDog;
  }

  exports.getDogs = getDogs;