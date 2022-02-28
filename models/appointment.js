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
        trim: true
    },
    dateTime: {
        type: Date,
        required: true
    },
    clientId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    dogId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    repeating: {
        type: Boolean,
        required: false
    },
    notes: {
        type: String,
        required: false
    }
    }, {collection: 'appointments_collection'});

    module.exports = AppointmentSchema;

 