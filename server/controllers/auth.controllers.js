const User = require("../models/user.models.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const errorHandler = require("../utils/error.js");

const signup = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(409, "User already exists"));
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return next(errorHandler(404, "User doesn't exist"));
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    if (!isPasswordCorrect) {
      return next(errorHandler(401, "Entered credentials are incorrect"));
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = existingUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true ,maxAge: 24 * 60 * 60 * 1000})
      .status(200)
      .json({
        user: rest,
        message: "Login successful"
      });
  } catch (err) {
    next(err);
  }
};

const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token").status(200).json({message:"User signed out successfully" })
  } catch (error) {
    next(error)
  }
};

module.exports = { signup,signin,signout };