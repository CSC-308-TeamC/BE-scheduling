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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
}); 