const mongoose = require('mongoose');
const ClientSchema = require('./client');
const dbConnection = require('./dbConnection');
let dbC = dbConnection.getDbConnection();

  async function getClients(){
      const clientModel = dbC.model('Client', ClientSchema);
      let testClient = [{firstName: 'Test firstName', lastName:'Test lastName', dogs: 'Dog 1, Dog 2, Dog 3', phoneNumber: 'XXX-XXX-XXXX'}];
      
      let result = await clientModel.find();
      return testClient;
  }

  exports.getClients = getClients;