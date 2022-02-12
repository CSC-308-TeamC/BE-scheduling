const express = require('express');
const cors = require('cors');
const appointmentServices = require('./models/appointment-services');
const clientServices = require('./models/client-services');
const dogServices = require('./models/dog-services');
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

app.get('/',  (req, res) => {
    res.redirect('/dashboard');
});

app.get('/dashboard', async (req, res) => {
    //Should become get AppointmentsFilterByDate
    const result = await appointmentServices.getAppointments();
    res.send({appointmentData: result});
});

app.get('/appointments', async(req, res) => {
    const result = await appointmentServices.getAppointments();
    res.send({appointmentData: result});
});

app.get('/clients', async(req, res) => {
    const result = await clientServices.getClients();
    res.send({clientData: result});
});

app.get('/dogs', async(req, res) => {
    const result = await dogServices.getDogs();
    res.send({dogData: result});
});

app.post('/appointments', async (req, res) => {
    const newAppointment = req.body;
    const savedAppointment = await appointmentServices.addAppointment(newAppointment);
    if(savedAppointment)
        res.status(201).send(savedAppointment);
    else
        res.status(500).end();
});

app.post('/clients', async (req, res) => {
    const newClient = req.body;
    const savedClient = await clientServices.addClient(newClient);
    if(savedClient)
        res.status(201).send(savedClient);
    else
        res.status(500).end();
});

app.post('/dogs', async (req, res) => {
    const newDog = req.body;
    const savedDog = await dogServices.addDog(newDog);
    if(savedDog)
        res.status(201).send(savedDog);
    else
        res.status(500).end();
});

app.delete('/appointments/:id', async (req, res) =>{
    const id = req.params.id;
    const result = await appointmentServices.deleteAppointmentById(id);
    if(result){
        res.status(204).end();
    }else{
        res.status(404).send('Resource not found');
    } 
});

app.delete('/clients/:id', async (req, res) =>{
    const id = req.params.id;
    const result = await clientServices.deleteClientById(id);
    if(result){
        res.status(204).end();
    }else{
        res.status(404).send('Resource not found');
    } 
});

app.delete('/dogs/:id', async (req, res) =>{
    const id = req.params.id;
    const result = await dogServices.deleteDogById(id);
    if(result){
        res.status(204).end();
    }else{
        res.status(404).send('Resource not found');
    } 
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
}); 