const express = require("express");
const router = express.Router();

//post method  to register and login post
const adminController = require("../controllers/adminController");

//authMiddleware get user data from token and validate the token
const authMiddleware = require("../authMiddleware/authMiddleware");

// Define the route for registering admin
router.route("/adminregister").post(adminController.register);
router.route("/adminlogin").post(adminController.login);

router.route("/allTickets").get(authMiddleware, adminController.getAllTickets);

//get admin data
router.route("/admindata").get(authMiddleware, adminController.admin);

//get customer data
router.route("/allcustomersdata").get(authMiddleware, adminController.customersCollection);

router.route("/allagentsdata").get(authMiddleware, adminController.agentsCollection);


module.exports = router;
