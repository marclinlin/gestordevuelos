const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = Schema({
  typeOfEvent: String,
  title: String,
  startTime: Object,
  endTime: Object,
  description: String,
  instructor: String,
  student: String,
  status: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('event', EventSchema);