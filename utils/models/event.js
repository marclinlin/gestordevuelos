const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = Schema({
  type: String,
  startTime: Date,
  endTime: Date,
  description: String,
  instructor: String,
  student: String,
  aircraft: String,
  room: String,
  Subject: String,
  status: {
    type: Boolean,
    default: false
  }
});


module.exports = mongoose.model('events', EventSchema);
