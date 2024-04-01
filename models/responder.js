const mongoose = require('mongoose');
const { ServerApiVersion } = require('mongodb');

// Connect to MongoDB Atlas using Mongoose
mongoose.connect('mongodb+srv://johnmaverickcisneros:qFHZMTWstIzxEfkB@cluster0.xld8ueb.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // Timeout after 5 seconds if connection fails
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Define reservation schema
const reservationSchema = new mongoose.Schema({
  name: { type: String, default: '' }, 
  reservation_id:  { type: String }, 
  student_id: { type: String, default: '' },
  laboratory: { type: String }, 
  room: { type: String }, 
  date: { type: String },
  start_time: { type: Number }, 
  end_time: { type: Number },
  seat_ids: [{ type: String }],
  equipment: [{ type: String }],
}, { versionKey: false });

// Define user schema
const userSchema = new mongoose.Schema({
  name: { type: String }, 
  user_id: { type: String },
  acc_type: { type: String },
  password: { type: String },
  image: { type: Buffer },
  desc: { type: String }
}, { versionKey: false });

// Create models
const Reservation = mongoose.model('Reservation', reservationSchema);
const User = mongoose.model('User', userSchema);

// Export models
module.exports.Reservation = Reservation; 
module.exports.User = User; 

// Handle errors
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

// Close connection on process exit
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

// responder.js

function finalClose() {
  console.log('Final close function called');
  // Any cleanup code you want to run before exiting
}

module.exports.finalClose = finalClose;
