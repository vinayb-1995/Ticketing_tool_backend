const express = require("express");
const Admin = require("../model/adminModel");
const Customer = require("../model/customerModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* Admin registration */  
const register = async (req, res) => {
  try {
    const { user_unique_ID,username, email, password, role } = req.body;
    const adminExist = await Admin.findOne({ email: email });
    if (adminExist) {
      return res.status(400).json({ message: "Admin already exists" });
    }
    const adminCreated = await Admin.create({
      user_unique_ID:email,
      username,
      email,
      password,
      role,
    });
   return res
      .status(201)
      .json({ message: "Admin created successfully", admin: adminCreated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* Admin login */
const login = async (req, res) => {
  try {
    const { user_unique_ID: email, password } = req.body;
        // console.log('uniqueid',user_unique_ID,password)
    const adminExist = await Admin.findOne({ email }); // Corrected variable name
    if (!adminExist) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isPasswordMatch = await bcrypt.compare(password, adminExist.password); // Corrected variable name
    if (isPasswordMatch) {
      const token = adminExist.generateAuthToken(); // Corrected variable name
      return res.status(200).json({
        message: "Login successful",
        token,
        userID: adminExist._id.toString(),
        role: adminExist.role,
      });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//to send admin data - admin Login:
const admin = async (req, res) => {
  try {
    const adminData = req.user;
    // console.log(adminData)
   return res.status(200).json({ adminBody: adminData });
  } catch (error) {
    // console.log(`error form the user route ${error}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//to send all customers data for customers collection filter by admin id
const customersCollection = async (req, res) => {
  try {
    // Ensure req.adminId is defined for debugging
    if (!req.adminId) {
      console.error("adminId not provided in request");
      return res.status(400).json({ message: "adminId is missing" });
    }
    const allCustomers = await Customer.find({ createdByAdmin: req.adminId });
    if (!allCustomers || allCustomers.length === 0) {
      return res.status(404).json({ message: "No customers found" });
    }
    // console.log("Sending response with customer data", allCustomers);
    return res.status(200).json(allCustomers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    if (!res.headersSent) {  // Check headers
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  }
};

//to send all agent data for agents collection filter by admin id
const agentsCollection = async (req, res) => {
  try {
    // Ensure req.adminId is defined for debugging
    if (!req.adminId) {
      console.error("adminId not provided in request");
      return res.status(400).json({ message: "adminId is missing" });
    }
    const allAgents = await Customer.find({ createdByAdmin: req.adminId });
    if (!allAgents || allAgents.length === 0) {
      return res.status(404).json({ message: "No Agents found" });
    }
    // console.log("Sending response with agents data", allAgents);
    return res.status(200).json(allAgents);
  } catch (error) {
    console.error("Error fetching Agents:", error);
    if (!res.headersSent) {  // Check headers
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  }
};
module.exports = { register, login, admin,customersCollection,agentsCollection };
