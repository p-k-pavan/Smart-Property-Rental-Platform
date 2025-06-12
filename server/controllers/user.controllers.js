const User = require("../models/user.models.js");
const bcrypt = require("bcrypt");
const errorHandler = require("../utils/error.js");

const updateProfile = async (req, res, next) => {
  const userId = req.user.id;
  const { name, email, password, role } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const updatedData = {};

    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (role) updatedData.role = role;

    if (password) {
      const isSame = bcrypt.compareSync(password, user.password);
      if (!isSame) {
        updatedData.password = bcrypt.hashSync(password, 10);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true }
    );

    const { password: pass, ...rest } = updatedUser._doc;

    res.status(200).json({
      message: "Profile updated successfully",
      user: rest,
    });
  } catch (err) {
    next(err);
  }
};

const deleteProfile = async (req, res, next) => {
  const userId = req.user.id; 

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User account deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(errorHandler(403, "Access denied: Admins only"));
    }

    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

const blockUser = async (req, res, next) => {
  const adminId = req.user.id;
  const { userId } = req.params;

  try {
    const admin = await User.findById(adminId);
    if (admin.role !== "admin") {
      return next(errorHandler(403, "Only admins can block users"));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    user.isBlocked = true;
    await user.save();

    res.status(200).json({ message: "User blocked successfully" });
  } catch (err) {
    next(err);
  }
};

const unblockUser = async (req, res, next) => {
  const adminId = req.user.id;
  const { userId } = req.params;

  try {
    const admin = await User.findById(adminId);
    if (admin.role !== "admin") {
      return next(errorHandler(403, "Only admins can unblock users"));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    user.isBlocked = false;
    await user.save();

    res.status(200).json({ message: "User unblocked successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = { updateProfile,deleteProfile,getAllUsers,blockUser, unblockUser };