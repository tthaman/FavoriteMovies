const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  password:  { type: String, required: true },
  email: { type: String, unique: true, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  avatar: { type: String },
  roles: { type: [String], required: true },
  secret: { type: String }
});


module.exports = mongoose.model("users", userSchema);