const mongoose = require('mongoose');

const DogSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    breed: {
        type: String,
        required: true,
        trim: true,
    },
    clientId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    }
    }, {collection: 'dogs_collection'});

    module.exports = DogSchema;