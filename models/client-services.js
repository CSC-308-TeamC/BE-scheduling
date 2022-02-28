const ClientSchema = require('./client');
const dbConnection = require('./dbConnection');
let dbC;

async function getClients() {
  dbC = dbConnection.getDbConnection();
  const clientModel = dbC.model('Client', ClientSchema);
  let formattedResult = await formatClientsArray(await clientModel.find().lean());
  return formattedResult;
}

async function addClient(client) {
  dbC = dbConnection.getDbConnection();
  const clientModel = dbC.model('Client', ClientSchema);
  try {
    const clientToAdd = new clientModel(client);
    var savedClient = await clientToAdd.save();

    let formattedClient = await formatClient(client);
    formattedClient._id = savedClient._id;

    return formattedClient;
  }catch (error) {
    console.log(error);
    return false;
  }
}

async function getClientById(id) {
  dbC = dbConnection.getDbConnection();
  const clientModel = dbC.model('Client', ClientSchema);
  try {
    let result = await clientModel.findById(id);
    return result;
  }catch (error) {
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

async function formatClientsArray(clients){
  let clientsConv = [];
  if(clients.length != 0){
    //Change Client fName and lName to full name
    clientsConv = await Promise.all(clients.map(async (client) => {
      return formatClient(client);      
    }));
  }
  return clientsConv;
}

async function formatClient(client){
  if(client){
    client['fullName'] = client.firstName + " " + client.lastName;
    delete client.firstName;
    delete client.lastName
    return client;  
  }
}



exports.getClients = getClients;
exports.getClientById = getClientById;
exports.addClient = addClient;
exports.deleteClientById = deleteClientById;
