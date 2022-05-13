const dogServices = require("../../DB-Modules/Services/dog-services");

async function get(req, res) {
  const format = req.params.format;
  const result = await dogServices.getDogs(format);
  res.send({ dogData: result });
}

async function getById(req, res) {
  const id = req.params.id;
  const format = req.query.format;
  const result = await dogServices.getDogById(id, format);

  if (result) res.send({ dogData: result }).end();
  else res.status(404).send("Resource not found");
}

async function create(req, res) {
  const newDog = req.body;
  const savedDog = await dogServices.addDog(newDog);
  if (savedDog) res.status(201).send({ dogData: savedDog });
  else res.status(500).end();
}

async function update(req, res) {
  const dogToUpdate = req.body;
  const updatedDog = await dogServices.updateDog(dogToUpdate);
  if (updatedDog) res.status(200).send({ dogData: updatedDog });
  else res.status(404).end();
}

async function remove(req, res) {
  const id = req.params.id;
  const result = await dogServices.deleteDogById(id);
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
