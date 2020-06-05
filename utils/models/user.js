const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
  role: String,
  id: String,
  age: Number,
  name: String,
  // firstName: String,
  // lastName: String,
  email: String,
  occupied: Array,
})


module.exports = mongoose.model('users', UserSchema);
