const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/labDB');

const reservationSchema = new mongoose.Schema({
    name: {type: String }, 
    id:  {type : String}, 
    laboratory: {type: String}, 
    room: {type: String}, 
    time_start: {type: String}, 
    time_end: {type: String}, 
    seats_ids: [{
        type: String
    }],
}, {versionKey: false});

const reservationModel = mongoose.model('reservation', reservationSchema);


function errorFn(err){
    console.log('Error fond. Please trace!');
    console.error(err);
}

module.exports.reservationModel = reservationModel; 
module.exports.errorFn = errorFn;

