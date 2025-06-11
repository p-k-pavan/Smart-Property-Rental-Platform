const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["tenant", "admin", "owner"],
    },
    isBlocked: {
    type: Boolean,
    default: false,
  },
  },
  { timestamps: true }
);

const User = model("User", userSchema);
module.exports = User;
