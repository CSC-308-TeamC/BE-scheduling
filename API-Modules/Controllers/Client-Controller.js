const clientServices = require("../../DB-Modules/Services/client-services");

async function get(req, res) {
  const format = req.params.format;
  const result = await clientServices.getClients(format);
  res.send({ clientData: result });
}

async function getById(req, res) {
  const id = req.params.id;
  const format = req.query.format;
  const result = await clientServices.getClientById(id, format);
  if (result) res.send({ clientData: result }).end();
  else res.status(404).send("Resource not found");
}

async function create(req, res) {
  const newClient = req.body;
  const savedClient = await clientServices.addClient(newClient);
  if (savedClient) res.status(201).send({ clientData: savedClient });
  else res.status(500).end();
}

async function update(req, res) {
  const clientToUpdate = req.body;
  const updatedClient = await clientServices.updateClient(clientToUpdate);
  if (updatedClient) res.status(200).send({ clientData: clientToUpdate });
  else res.status(404).end();
}

async function remove(req, res) {
  const id = req.params.id;
  const result = await clientServices.deleteClientById(id);
  if (result) {
    res.status(204).end();
  } else {
    res.status(404).send("Resource not found");
  }
}

module.exports = {
  get,
  getById,
  create,
  update,
  remove,
};
