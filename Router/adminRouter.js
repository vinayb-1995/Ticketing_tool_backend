const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Define the route for registering admin
router.route("/adminregister").post(adminController.register);

module.exports = router;
