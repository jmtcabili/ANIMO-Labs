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
const collectionName = "lab";

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
  dbo.createCollection(collectionName)
    .then(successFn)
    .catch(function (err){
      console.log('Collection already exists');
  });
}).catch(errorFn);


const Reservation = require('./public/common/func');

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

server.get('/lab-profile', async  function(req, resp){
  try {
    const db = mongoClient.db(databaseName);
    const collection = db.collection(collectionName);

    const upcomingReservations = await Reservation.find().exec();

    resp.render('lab-profile', {
      layout: 'user-index',
      title: 'Lab Profile',
      style: '/common/lab-style.css',
      script: '/common/lab-profile.js',
      upcomingReservations: upcomingReservations
    });
  } catch (err) {
    console.error('Error fetching upcoming reservations:', err);
    resp.status(500).send('Internal Server Error');
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