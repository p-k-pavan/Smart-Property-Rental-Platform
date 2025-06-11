const express = require("express");
const { createProperty, updateProperty,deleteProperty,getPropertyById,getAllProperties} = require("../controllers/property.controllers");
const VerifyToken = require("../utils/VerifyToken");
const router = express.Router();

router.post("/",VerifyToken ,createProperty);
router.put("/:id",VerifyToken,updateProperty)
router.delete("/:id",VerifyToken,deleteProperty)
router.get("/:id",getPropertyById)
router.get("/", getAllProperties);

module.exports = router;
