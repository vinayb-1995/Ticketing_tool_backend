const express = require("express");
const Admin = require("../model/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* Admin registration */
const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const adminExist = await Admin.findOne({ email: email });
    if (adminExist) {
      return res.status(400).json({ message: "Admin already exists" });
    }
    const adminCreated = await Admin.create({
      username,
      email,
      password,
      role,
    });
    res
      .status(201)
      .json({ message: "Admin created successfully", admin: adminCreated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* Admin login */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
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
    // console.log(userData)
    res.status(200).json({ adminBody: adminData });
  } catch (error) {
    console.log(`error form the user route ${error}`);
  }
};
module.exports = { register, login, admin };
