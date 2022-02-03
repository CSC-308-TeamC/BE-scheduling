const express = require('express');
const cors = require('cors');
const appointmentServices = require('./models/appointment-services');
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.redirect('/dashboard');
});

app.get('/dashboard', (req, res) => {
    const result = appointmentServices.getAppointments();
    res.send({appointmentData: result});
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});   