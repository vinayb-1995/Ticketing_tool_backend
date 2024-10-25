const Customer = require("../model/customerModel");
const bcrypt = require("bcrypt");

/* Customer registration */
const register = async (req, res) => {
  try {
    const { firstname, lastname, email, secondaryemail,password,mobile,alternativemobile,companyorgnizationname,preferedcontactmethod,accountstatus,createdByAdmin } = req.body;

    // console.log('Registering customer:', { firstname, lastname, email, createdByAdmin });

    // Check if the customer already exists for the admin
    const customerExist = await Customer.findOne({ email, createdByAdmin });
    if (customerExist) {
      return res.status(400).json({ message: "Customer with this email already exists for this admin" });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new customer
    const newCustomer = await Customer.create({
      firstname,
      lastname,
      email,
      secondaryemail,
      password: hashedPassword,
      mobile,
      alternativemobile,
      createdByAdmin,
      companyorgnizationname,
      preferedcontactmethod,
      accountstatus,
    });

    res.status(201).json({ message: "Customer created successfully", customer: newCustomer });
  } catch (error) {
    console.error('Error in customer registration:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Customer with this email already exists for this admin" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { register };
