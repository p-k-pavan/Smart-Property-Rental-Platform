const Property = require("../models/property.models.js");
const User = require("../models/user.models.js");
const errorHandler = require("../utils/error.js");
const mongoose = require("mongoose");

const createProperty = async (req, res, next) => {
  try {
    const {
      title,
      price,
      location,
      description,
      amenities,
      ownerId,
      propertyType,
      availableFrom,
      bedrooms,
      bathrooms,
      elevator,
      sqfeet
    } = req.body;

    console.log("Uploaded files:", req.files);
  
    if (
      !title || !price || !location || !description || !ownerId ||
      !propertyType || elevator === undefined || !sqfeet
    ) {
      return next(errorHandler(400, "All required fields must be provided"));
    }

    if (!req.files || req.files.length === 0) {
      return next(errorHandler(400, "At least one image is required"));
    }

    const user = await User.findById(ownerId);
    if (!user) return next(errorHandler(404, "User not found"));
    if (user.role !== "owner" && user.role !== "admin") {
      return next(errorHandler(403, "Unauthorized"));
    }

    const parsedAmenities = Array.isArray(amenities) ? amenities : [amenities];

    const imageUrls = req.files.map(file => file.path);

    const listing = await Property.create({
      title,
      price,
      location,
      description,
      amenities: parsedAmenities,
      images: imageUrls,
      ownerId,
      propertyType,
      availableFrom: availableFrom ? new Date(availableFrom) : undefined,
      bedrooms: bedrooms ? Number(bedrooms) : 0,
      bathrooms: bathrooms ? Number(bathrooms) : 0,
      elevator: elevator === 'true' || elevator === true,
      sqfeet: Number(sqfeet)
    });

    res.status(201).json(listing);
  } catch (err) {
    next(err);
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
  const ownerId = req.headers['owner-id'];

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


    if (search) {
      const regex = new RegExp(search, "i"); 
      filter.$or = [
        { title: regex },
        { location: regex },
        { description: regex },
      ];
    }


    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }


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
