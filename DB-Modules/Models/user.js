const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
    },
    administraor: {
      type: Boolean,
      required: true,
    },
    associatedClient: {
      type: mongoose.Schema.ObjectId,
      rquired: false,
    },
  },
  { collection: "users_collection" }
);

module.exports = UserSchema;
