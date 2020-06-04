const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema ({
    typeOfUser: String,
    userId: String,
    age: Number,
    firstName: String,
    lastName: String,
    email:String,
    occupied: Array, 
  })
  
  
  module.exports = mongoose.model('users', UserSchema);
  