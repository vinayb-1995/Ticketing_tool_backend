const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController'); // Update the path if necessary

// Customer registration route
router.post('/customerregister', customerController.register);

module.exports = router;
