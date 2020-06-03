const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema ({
    typeOfUser: String,
    age: Number,
    firstName: String,
    lastName: String,
    occupied: Array, 
  })
  
  
  module.exports = mongoose.model('users', UserSchema);
  