const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    dogs: {
      type: String, //[{type: mongoose.Schema.ObjectId, ref:'dog'}],
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
  },
  { collection: "clients_collection" }
);

module.exports = ClientSchema;
