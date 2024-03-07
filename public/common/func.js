const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  reservationNumber: String,
  laboratory: String,
  time: String,
  studentId: String
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
