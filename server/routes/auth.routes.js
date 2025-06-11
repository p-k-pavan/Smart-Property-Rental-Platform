const express = require("express");
const router = express.Router();
const { signup, signin,signout} = require("../controllers/auth.controllers.js");
const isActive = require("../middleware/auth.js");

router.post("/register",signup)
router.post("/login",isActive,signin)
router.get('/signout',signout)
module.exports = router;
