const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/labDB');

const reservationSchema = new mongoose.Schema({
    name: {type: String }, 
    reservation_id:  {type : String}, 
    student_id: {type: String},
    laboratory: {type: String}, 
    room: {type: String}, 
    date: {type: Date},
    start_time: {type: Number}, 
    end_time: {type: Number},
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
    console.log('Error found. Please trace!');
    console.error(err);
}

function finalClose(){
    console.log('Close connection at the end!');
    mongoose.connection.close();
    process.exit();
}


module.exports.reservationModel = reservationModel; 
module.exports.userModel = userModel; 
module.exports.errorFn = errorFn;
module.exports.finalClose = finalClose; 

