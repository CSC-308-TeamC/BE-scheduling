const mongoose = require('mongoose');


const AppointmentSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
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
    date: {
        type: String, //Date,
        required: true
    },
    time: {
        type: String, //Date,
        required: true
    },
    clientId: {
        type: Number, //mongoose.Schema.ObjectId,
        required: true
    },
    dogId: {
        type: Number, //mongoose.Schema.ObjectId,
        required: true
    },
    repeating: {
        type: String, //Boolean,
        required: false
    },
    notes: {
        type: String,
        required: false
    }
    }, {collection: 'appointments_collection'});

    module.exports = AppointmentSchema;

 