const express = require("express");
const Admin = require("../model/adminModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const register = async function(req, res) {
    try {
        const { username, email, password, role } = req.body;
        const adminExist = await Admin.findOne({ email: email });
        if (adminExist) {
            return res.status(400).json({ message: "Admin already exists" });
        }
        const adminCreated = await Admin.create({ username, email, password, role });
        res.status(201).json({ message: "Admin created successfully", admin: adminCreated });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { register };
