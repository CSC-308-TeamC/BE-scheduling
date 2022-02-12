const ClientSchema = require('./client');
const dbConnection = require('./dbConnection');
let dbC;

async function getClients() {
  dbC = dbConnection.getDbConnection();
  const clientModel = dbC.model('Client', ClientSchema);
  let testClient = [{ firstName: 'Test firstName', lastName: 'Test lastName', dogs: 'Dog 1, Dog 2, Dog 3', phoneNumber: 'XXX-XXX-XXXX' }];

  let result = await clientModel.find();
  return result;
}

async function addClient(client) {
  dbC = dbConnection.getDbConnection();
  const clientModel = dbC.model('Client', ClientSchema);
  try {
    const clientToAdd = new clientModel(client);
    const savedclient = await clientToAdd.save()
    return savedclient;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function deleteClientById(id) {
  dbC = dbConnection.getDbConnection();
  const clientModel = dbC.model('Client', ClientSchema);
  try {
    return await clientModel.findByIdAndRemove(id);
  } catch (error) {
    console.log(error);
    return false;
  }
}

exports.getClients = getClients;
exports.addClient = addClient;
exports.deleteClientById = deleteClientById;