const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/labDB');

const reservationSchema = new mongoose.Schema({
    name: {type: String }, 
    reservation_id:  {type : String}, 
    laboratory: {type: String}, 
    room: {type: String}, 
    date: {type: Date},
    time_start: {type: String}, 
    time_end: {type: String}, 
    seat_ids: [{
        type: String
    }],
    equipment: [{
        type: String
    }],
}, {versionKey: false});

const userSchema = new mongoose.Schema({
    name: {type: String}, 
    student_id: {type: String}, 
    image: {type: Buffer},
    desc : {type: String},
    type: {type: String},
}, {versionKey: false});

const reservationModel = mongoose.model('reservation', reservationSchema);
const userModel = mongoose.model('user', userSchema); 




function errorFn(err){
    console.log('Error fond. Please trace!');
    console.error(err);
}

module.exports.reservationModel = reservationModel; 
module.exports.userModel = userModel; 
module.exports.errorFn = errorFn;

