const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  joiningYear: {
    type: String,
  },
  dob: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
  },
  contactNumber: {
    type: Number,
  },
  role: {
    type: String,
    default: "admin",
  },
});

adminSchema.methods.getJwtToken = function () {
  const token = jwt.sign({ email: this.email, id: this._id }, process.env.KEY);
  return token;
};

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 10);
});

adminSchema.methods.comparePassword = async function (enteredPassword) {
  const validPassword = await bcrypt.compare(enteredPassword, this.password);
  return validPassword;
};

const adminModel = new mongoose.model("Admin", adminSchema);

module.exports = adminModel;
