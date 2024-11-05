const Tickets = require("../model/ticketModel");

// Create a new ticket with image upload
exports.createTicket = async (req, res) => {
  try {
    const {
      uniqueticketID,
      adminName,
      adminId,
      adminMailID,
      customerName,
      customerID,
      customerMailID,
      customerContactNumber,
      department,
      subModule,
      issueType,
      description,
    } = req.body;

    // Handle image upload
    let imagePath = "";
    if (req.file) {
      imagePath = req.file.path; // Multer provides the path of the uploaded file
    }
    const newTicket = new Tickets({
      uniqueticketID,
      adminName,
      adminId,
      adminMailID,
      customerName,
      customerID,
      customerMailID,
      customerContactNumber,
      department,
      subModule,
      issueType,
      description,
      image: imagePath, // Store the image path in the DB
    });

    const savedTicket = await newTicket.save();
    res.status(201).json(savedTicket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
