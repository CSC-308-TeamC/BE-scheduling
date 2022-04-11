const express = require('express');
const cors = require('cors');
const appointmentServices = require('./DB-Modules/Services/appointment-services');
const clientServices = require('./DB-Modules/Services/client-services');
const dogServices = require('./DB-Modules/Services/dog-services');
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());


//Get requests-------------------------------------------------------------------------------------------------------
app.get('/',  (req, res) => {
    res.redirect('/dashboard');
});

app.get('/dashboard', async (req, res) => {
    //Should become get AppointmentsFilterByDate
    const result = await appointmentServices.getTodaysAppointments();
    res.send({appointmentData: result});
});

app.get('/appointments', async(req, res) => {
    const result = await appointmentServices.getAppointments();
    res.send({appointmentData: result});
});

app.get('/appointments/:id/:format', async(req, res) => {
    const id = req.params.id;
    const format = req.params.format;
    var result;
    result = await appointmentServices.getAppointmentById(id, format);
    
    if(result){
        res.send({appointmentData: result});
    }else{
        res.status(404).send('Resource not found');
    } 
});



app.get('/clients', async(req, res) => {
    const result = await clientServices.getClients();
    res.send({clientData: result});
});

app.get('/clients/:id', async (req, res) =>{
    const id = req.params.id;
    const result = await clientServices.getClientById(id);
    if(result)
        res.send({clientData: result}).end();
    else
        res.status(404).send('Resource not found');
});

app.get('/dogs', async(req, res) => {
    const result = await dogServices.getDogs();
    res.send({dogData: result});
});

app.get('/dogs/:id', async(req, res) => {
    const id = req.params.id;
    const result = await dogServices.getDogById(id);
    if(result)
        res.send({dogData: result}).end();
    else
        res.status(404).send('Resource not found');
});



//Post Requests-------------------------------------------------------------------------------------------------------
app.post('/appointments', async (req, res) => {
    const newAppointment = req.body;
    const savedAppointment = await appointmentServices.addAppointment(newAppointment);
    if(savedAppointment)
        res.status(201).send({appointmentData: savedAppointment});
    else
        res.status(500).end();
});

app.post('/clients', async (req, res) => {
    const newClient = req.body;
    const savedClient = await clientServices.addClient(newClient);
    if(savedClient)
        res.status(201).send({clientData: savedClient});
    else
        res.status(500).end();
});

app.post('/dogs', async (req, res) => {
    const newDog = req.body;
    const savedDog = await dogServices.addDog(newDog);
    if(savedDog)
        res.status(201).send({dogData: savedDog});
    else
        res.status(500).end();
});

//Patch requests-------------------------------------------------------------------------------------------------------
app.patch('/appointments', async (req, res) => {
    const appointmentToUpdate = req.body;
    const updatedAppointment = await appointmentServices.updateAppointment(appointmentToUpdate);
    if(updatedAppointment)
        res.status(200).send({appointmentData: updatedAppointment});
    else
        res.status(404).end();
})

app.patch('/clients', async (req, res) => {
    const clientToUpdate = req.body;
    const updatedClient = await clientServices.updateClient(clientToUpdate);
    if(updatedClient)
        res.status(200).send({clientData: clientToUpdate});
    else
        res.status(404).end();
})

app.patch('/dogs', async (req, res) => {
    const dogToUpdate = req.body;
    const updatedDog = await dogServices.updateDog(dogToUpdate);
    if(updatedDog)
        res.status(200).send({dogData: updatedDog});
    else
        res.status(404).end();
})

//Delete requests-------------------------------------------------------------------------------------------------------
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
    console.log(`Application listening at http://localhost:${port}`);
}); 