const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomsSchema = Schema({
    name: String
});


module.exports = mongoose.model('rooms', RoomsSchema);
