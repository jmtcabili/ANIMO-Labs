//npm i express express-handlebars body-parser mongodb mongoose

const express = require('express');
const server = express();


const bodyParser = require('body-parser');
server.use(express.json()); 
server.use(express.urlencoded({ extended: true }));

const handlebars = require('express-handlebars');
server.set('view engine', 'hbs');
server.engine('hbs', handlebars.engine({
    extname: 'hbs',
}));

server.use(express.static('public'));

const { MongoClient } = require('mongodb');
const databaseURL = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(databaseURL);

const databaseName = "labDB";
const lab_upcoming = "lab-upcoming";
const lab_recent = "lab-recent";

function errorFn(err){
  console.log('Error fond. Please trace!');
  console.error(err);
}

function successFn(res){
  console.log('Database query successful!');
}

mongoClient.connect().then(function(con){
  //Only do database manipulation inside of the connection
  //When a connection is made, it will try to make the database
  //automatically. The collection(like a table) needs to be made.
  console.log("Attempt to create!");
  const dbo = mongoClient.db(databaseName);
  //Will create a collection if it has not yet been made
  dbo.createCollection(lab_upcoming)
    .then(successFn)
    .catch(function (err){
      console.log('Collection already exists');
  });
  dbo.createCollection(lab_recent)
  .then(successFn)
  .catch(function (err){
    console.log('Collection already exists');
});

}).catch(errorFn);


const Reservation = require('./public/common/script');

server.get('/', function(req, resp){
  resp.render('login',{
      layout: 'index',
      title: 'Login Page',
      style: '/common/login-style.css'
  });
});

server.get('/sign-up', function(req, resp){
  resp.render('sign-up',{
      layout: 'index',
      title: 'Sign Up',
      style: '/common/signup-style.css'
  });
});

server.get('/user-profile', function(req, resp){
  resp.render('user-profile',{
      layout: 'user-index',
      title: 'User Profile',
      style: '/common/user-style.css',
      script: '/common/user-profile.js'
  });
});

server.get('/lab-profile', async function(req, resp){
  try {
    // Connect to MongoDB
    await mongoClient.connect();
    console.log("Connected to MongoDB");

    // Get reference to the database and collection
    const db = mongoClient.db(databaseName);
    const lab_upcoming = db.collection("lab-upcoming");
    const lab_recent = db.collection("lab-recent");

    // Query MongoDB to retrieve upcoming reservations
    const upcomingReservations = await lab_upcoming.find({}).toArray();
    const recentActivity = await lab_recent.find({}).toArray();

    // Render the 'lab-profile' view and pass the retrieved data
    resp.render('lab-profile', {
        layout: 'user-index',
        title: 'Lab Profile',
        style: '/common/lab-style.css',
        script: '/common/lab-profile.js',
        upcomingReservations: upcomingReservations,
        recentActivity: recentActivity
    });
} catch (err) {
    console.error('Error fetching data:', err);
    resp.status(500).send('Internal Server Error');
} finally {
    // Close the MongoDB connection
    await mongoClient.close();
}
});

server.get('/lab-selection', function(req, resp){
  resp.render('lab-selection',{
      layout: 'selection-index',
      title: 'Lab Selection',
      style: '/common/selection-style.css'
  });
});

server.get('/chem-lab', function(req, resp){
  resp.render('lab-menu',{
      layout: 'selection-index',
      title: 'Chem Lab',
      style: '/common/selection-style.css'
  });
});


const port = process.env.PORT | 3000;
server.listen(port, function(){
  console.log('Listening at port '+port);
});
