const mongoose = require('mongoose');

const DogSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
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
        type: Number, //mongoose.Schema.ObjectId,
        required: true,
    }
    }, {collection: 'dogs_collection'});

    module.exports = DogSchema;
    