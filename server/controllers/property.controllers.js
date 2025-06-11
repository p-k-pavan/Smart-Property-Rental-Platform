const Property = require("../models/property.models.js");
const User = require("../models/user.models.js");
const errorHandler = require("../utils/error.js");
const mongoose = require("mongoose");

const createProperty = async (req, res, next) => {
  const { title, price, location, image, description, amenities, ownerId } = req.body;

  if (!title || !price || !location || !image || !description || !ownerId) {
    return next(errorHandler(400, "All required fields must be filled"));
  }

  if (!Array.isArray(image) || image.length === 0) {
    return next(errorHandler(400, "At least one image is required"));
  }

  if (!mongoose.Types.ObjectId.isValid(ownerId)) {
    return next(errorHandler(400, "Invalid owner ID"));
  }

  try {
    const user = await User.findById(ownerId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    if (user.role !== "owner" && user.role !== "admin") {
      return next(errorHandler(403, "Only owners or admins can create property listings"));
    }
    const listing = await Property.create(req.body);
    res.status(201).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

const updateProperty = async (req, res, next) => {
  const propertyId = req.params.id;
  const { title, price, location, image, description, amenities, ownerId } = req.body;

  if (!title || !price || !location || !image || !description || !ownerId) {
    return next(errorHandler(400, "All required fields must be filled"));
  }

  if (!Array.isArray(image) || image.length === 0) {
    return next(errorHandler(400, "At least one image is required"));
  }

  if (!mongoose.Types.ObjectId.isValid(ownerId)) {
    return next(errorHandler(400, "Invalid owner ID"));
  }

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return next(errorHandler(400, "Invalid property ID"));
  }

  try {
    const user = await User.findById(ownerId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return next(errorHandler(404, "Property not found"));
    }

    if (property.ownerId.toString() !== ownerId && user.role !== "admin") {
      return next(errorHandler(403, "You are not authorized to update this property"));
    }

    const updated = await Property.findByIdAndUpdate(
      propertyId,
      { title, price, location, image, description, amenities },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProperty = async (req, res, next) => {
  const propertyId = req.params.id;
  const { ownerId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return next(errorHandler(400, "Invalid property ID"));
  }

  if (!mongoose.Types.ObjectId.isValid(ownerId)) {
    return next(errorHandler(400, "Invalid owner ID"));
  }

  try {
    const user = await User.findById(ownerId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return next(errorHandler(404, "Property not found"));
    }

    if (property.ownerId.toString() !== ownerId && user.role !== "admin") {
      return next(errorHandler(403, "You are not authorized to delete this property"));
    }

    await Property.findByIdAndDelete(propertyId);

    res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getPropertyById = async (req, res, next) => {
  const propertyId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return next(errorHandler(400, "Invalid property ID"));
  }

  try {
    const property = await Property.findById(propertyId);

    if (!property) {
      return next(errorHandler(404, "Property not found"));
    }

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

const getAllProperties = async (req, res, next) => {
  try {
    const { search, minPrice, maxPrice, amenities } = req.query;

    let filter = {};

    // Search filter (title, location, description)
    if (search) {
      const regex = new RegExp(search, "i"); // case-insensitive
      filter.$or = [
        { title: regex },
        { location: regex },
        { description: regex },
      ];
    }

    // Price filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Amenities filter
    if (amenities) {
      const amenitiesArray = Array.isArray(amenities)
        ? amenities
        : amenities.split(",");
      filter.amenities = { $all: amenitiesArray }; // must include all
    }

    const properties = await Property.find(filter).populate("ownerId", "name email role");

    res.status(200).json({
      success: true,
      total: properties.length,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createProperty,updateProperty,deleteProperty ,getPropertyById,getAllProperties};
