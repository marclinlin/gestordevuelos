const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = Schema({
  title: String,
  description: String,
  status: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('event', EventSchema);