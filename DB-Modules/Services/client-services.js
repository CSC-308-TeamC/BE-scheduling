const ClientSchema = require("../Models/client");
const dbConnection = require("../dbConnection");
let dbC;

function setConnection(newConnection) {
  dbC = newConnection;
  return dbC;
}

async function getClients() {
  dbC = dbConnection.getDbConnection(dbC);
  const clientModel = dbC.model("Client", ClientSchema);
  let clientResults = await formatClientsArray(await clientModel.find().lean());
  return clientResults;
}

async function getClientById(id) {
  dbC = dbConnection.getDbConnection(dbC);
  const clientModel = dbC.model("Client", ClientSchema);
  try {
    let result = await clientModel.findById(id).lean();
    await formatClient(result);
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function addClient(client) {
  dbC = dbConnection.getDbConnection(dbC);
  const clientModel = dbC.model("Client", ClientSchema);
  try {
    const clientToAdd = new clientModel(client);
    var savedClient = await clientToAdd.save();

    await formatClient(client);
    client._id = savedClient._id;

    return client;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function updateClient(client) {
  dbC = dbConnection.getDbConnection(dbC);
  const clientModel = dbC.model("Client", ClientSchema);
  try {
    let updatedClient = await clientModel
      .findOneAndUpdate(
        { _id: client._id },
        {
          firstName: client.firstName,
          lastName: client.lastName,
          dogs: client.dogs,
          phoneNumber: client.phoneNumber,
        },
        { returnOriginal: false }
      )
      .lean();
    await formatClient(updatedClient);
    return updatedClient;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function deleteClientById(id) {
  dbC = dbConnection.getDbConnection(dbC);
  const clientModel = dbC.model("Client", ClientSchema);
  try {
    return await clientModel.findByIdAndRemove(id);
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function formatClientsArray(clients) {
  let clientsConv = [];
  if (clients.length != 0) {
    clientsConv = await Promise.all(
      clients.map(async (client) => {
        return formatClient(client);
      })
    );
  }
  return clientsConv;
}

async function formatClient(client) {
  if (client) {
    client["fullName"] = client.firstName + " " + client.lastName;
    delete client.firstName;
    delete client.lastName;
    return client;
  }
}

exports.setConnection = setConnection;
exports.getClients = getClients;
exports.getClientById = getClientById;
exports.addClient = addClient;
exports.updateClient = updateClient;
exports.deleteClientById = deleteClientById;
