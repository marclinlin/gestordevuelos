const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AircraftSchema = Schema({
    name: String
});


module.exports = mongoose.model('aircraft', AircraftSchema);
