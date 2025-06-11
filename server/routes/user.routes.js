const express = require("express");
const router = express.Router();
const VerifyToken = require("../utils/VerifyToken");
const { blockUser, unblockUser, getAllUsers, deleteProfile, updateProfile } = require("../controllers/user.controllers");
const checkAdmin = require("../middleware/checkAdmin");

router.put("/profile",VerifyToken,updateProfile)
router.delete("/profile", VerifyToken, deleteProfile);
router.get("/users", VerifyToken, checkAdmin, getAllUsers);
router.put("/block/:userId", VerifyToken, blockUser);
router.put("/unblock/:userId", VerifyToken, unblockUser);


module.exports = router;