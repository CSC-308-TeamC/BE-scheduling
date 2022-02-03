const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    clientId: {
        type: String,
        required: true,
    },}, {collection: 'appointments_collection'});

    module.exports = AppointmentSchema;