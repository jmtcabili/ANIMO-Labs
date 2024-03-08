const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  reservationNumber: { type: String },
  laboratory: { type: String },
  time: { type: String },
  studentId: { type: String }
});



const UserProfile = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  image: { type : Buffer}
});

