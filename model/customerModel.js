const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Create user schema
const CustomerSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  secondaryemail: { type: String },
  mobile: { type: String, required: true },
  alternativemobile: { type: String },
  password: { type: String, required: true },
  companyorgnizationname: { type: String },
  preferedcontactmethod: { type: String },
  accountstatus: { type: String, default: 'active' },
  role: { type: String, default: 'customer' }, // default role is customer
  createdByAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' } // Tracks the admin who created the account
});

// Create a compound index to ensure email is unique per admin
CustomerSchema.index({ email: 1, createdByAdmin: 1 }, { unique: true });

// Pre-save hook to hash password before saving the user
CustomerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Customer = mongoose.model("Customer", CustomerSchema);
module.exports = Customer;
