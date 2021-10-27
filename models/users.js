const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
  username: { type: String, required: true, unique: true },
  password: String,
  drawers: []
})

const User = mongoose.model('User', userSchema);

module.exports = User;
