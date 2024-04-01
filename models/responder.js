const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://johnmaverickcisneros:qFHZMTWstIzxEfkB@cluster0.xld8ueb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://johnmaverickcisneros:qFHZMTWstIzxEfkB@cluster0.xld8ueb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


const reservationSchema = new mongoose.Schema({
    name: {type: String, default: function() { return this.parent().name; } }, 
    reservation_id:  {type : String}, 
    student_id: {type: String, default: function() { return this.parent().student_id; } },
    laboratory: {type: String}, 
    room: {type: String}, 
    date: {type: String},
    start_time: {type: Number}, 
    end_time: {type: Number},
    seat_ids: [{
        type: String
    }],
    equipment: [{
        type: String
    }],
}, {versionKey: false});


// was thinking maybe we split the user and lab tech schema 
const userSchema = new mongoose.Schema({
    name: {type: String}, 
    user_id: {type: String},
    acc_type: {type: String},
    password: {type: String},
    image: {type: Buffer},
    desc : {type: String}
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

