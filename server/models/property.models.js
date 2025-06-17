const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const propertySchema = new Schema(
  {
    propertyType: {
      type: String,
      enum: ["Apartment", "Villa", "PG", "Commercial", "Plot"],
      required: true
    },
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
    images: {
      type: [String],
      required: true,
      validate: [array => array.length > 0, 'At least one image is required']
    },
    description: {
      type: String,
      required: true
    },
    amenities: {
      type: [String],
      default: []
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    availableFrom: {
      type: Date
    },
    bookingStatus: {
      type: Boolean,
      default: false,
      required: true
    },
    bedrooms: {
      type: Number,
      default: 0
    },
    bathrooms: {
      type: Number,
      default: 0
    },
    elevator: {
      type: Boolean,
      required: true
    },
    sqfeet: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

const Property = model("Property", propertySchema);
module.exports = Property;
