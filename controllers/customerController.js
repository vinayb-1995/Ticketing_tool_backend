const Admin = require("../model/adminModel");
const Customer = require("../model/customerModel");

/* Customer registration */
const register = async (req, res) => {
  try {
    const { customAlphabet } = await import("nanoid");
    const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 5);

    const {
      firstname,
      lastname,
      email,
      secondaryemail,
      password,
      mobile,
      alternativemobile,
      companyorgnizationname,
      preferedcontactmethod,
      accountstatus,
      createdByAdmin,
    } = req.body;

    // console.log('Registering customer:', { firstname, lastname, email, createdByAdmin });
    // Check if the customer already exists for the admin
    const customerExist = await Customer.findOne({ email, createdByAdmin });
    if (customerExist) {
      return res
        .status(400)
        .json({
          message: "Customer with this email already exists for this admin",
        });
    }

    // Generate a unique customer ID in the format CUST-XXXXX
    const user_unique_ID = `CUST-${nanoid()}`;
    // console.log("user_unique_ID>>",user_unique_ID)
    const admin = await Admin.findById(createdByAdmin).select("username email");
    // console.log('admin>>',admin)
    // Create new customer
    const newCustomer = await Customer.create({
      user_unique_ID,
      firstname,
      lastname,
      email,
      secondaryemail,
      password,
      mobile,
      alternativemobile,
      createdByAdmin,
      companyorgnizationname,
      preferedcontactmethod,
      accountstatus,
      createdByAdmin,
      adminDetails: {
        // New field for admin's details
        _id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    });
    // console.log("new customeer",newCustomer)
    return res
      .status(201)
      .json({
        message: "Customer created successfully",
        customer: newCustomer,
      });
  } catch (error) {
    console.error("Error in customer registration:", error);
    if (error.code === 11000) {
      return res
        .status(400)
        .json({
          message: "Customer with this email already exists for this admin",
        });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* customer  login */
const login = async (req, res) => {
  try {
    const { user_unique_ID, password } = req.body;
    // console.log("Login attempt:", { user_unique_ID, password,  });
    // Validate input
    if (!user_unique_ID || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both Customer ID and Password" });
    }
    const customer = await Customer.findOne({
      user_unique_ID,
    });
    // console.log("customer>>", customer);
    if (!customer) {
      return res
        .status(401)
        .json({ message: "Invalid Customer ID or Password" });
    }
    // Use the comparePassword method to validate the password
    const isPasswordMatch = await customer.comparePassword(password);
    // console.log("Password match result:", isPasswordMatch);

    if (isPasswordMatch) {
      const token = customer.generateAuthToken();
      return res.status(200).json({
        message: "Login successful",
        token,
        userID: customer._id.toString(),
        role: customer.role,
      });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//to send customer data - customer Login:
const customer = async (req, res) => {
  try {
    const customerData = req.user;
    // const adminData=customerData.populate('createdByAdmin')
    // console.log(customerData);
    // console.log(adminData)
    return res.status(200).json({ customerBody: customerData });
  } catch (error) {
    console.log(`error form the user route ${error}`);
  }
};

module.exports = { register, login, customer };
