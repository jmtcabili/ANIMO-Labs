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

const responder = require('./models/responder');

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

server.get('/lab-profile', function(req, resp){

    const searchQuery = {}; 
    responder.reservationModel.find(searchQuery).lean().then(function(reservation_data){
      resp.render('lab-profile', {
        layout: 'user-index',
        title: 'Lab Profile',
        style: '/common/lab-style.css',
        script: '/common/lab-profile.js',
        upcomingReservations: reservation_data
        //upcomingReservations: upcomingReservations,
        //recentActivity: recentActivity
    });
  }).catch(responder.errorFn());
});
    

server.get('/lab-selection', function(req, resp){
  resp.render('lab-selection',{
      layout: 'selection-index',
      title: 'Lab Selection',
      style: '/common/selection-style.css'
  });
});

server.get('/slot-reservation', function(req, resp){
  resp.render('slot-reservation',{
      layout: 'index',
      title: 'Chemistry Lab(need to make param)',
      style: '/common/slot-style.css'
  });
});

server.get('/add-equipment', function(req, resp){
  resp.render('add-equipment',{
      layout: 'index',
      title: 'Add Equipment(need to make dynamic url to mention lab)',
      style: '/common/equipment-style.css'
  });
});

server.get('/receipt', function(req, resp){
  resp.render('receipt',{
      layout: 'index',
      title: 'receipt',
      style: '/common/receipt-style.css'
  });
});

server.get('/reservation-details', function(req, resp){
  resp.render('reservation-details',{
      layout: 'index',
      title: 'Reservation Details',
      style: '/common/receipt-style.css'
  });
});


const port = process.env.PORT | 3000;
server.listen(port, function(){
  console.log('Listening at port '+port);
});