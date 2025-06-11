const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const propertySchema = new Schema(
  {
    title: { 
      type: String,
      required: true 
    },
    price: {
      type: Number,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    image: {
      type: [String],
      required: true,
      validate: [array => array.length > 0, 'At least one image is required']
    },
    description: {
      type: String,
      required: true
    },
    amenities: [String], 
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

const Property = model("Property", propertySchema); 
module.exports = Property;
