const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const upload = require('../authMiddleware/uploadMiddleware'); // Multer middleware

// Create a new ticket with image upload
router.post('/createTicket', upload.single('image'), ticketController.createTicket);

// Other routes...

module.exports = router;
