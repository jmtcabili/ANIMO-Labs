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
  const searchQuery = { name: "John Doe" }; //replace with proper parameter once log in is working
  // Fetch user data
  const userPromise = responder.userModel.find(searchQuery).lean();
    
  // Fetch reservation data
  const reservationPromise = responder.reservationModel.find(searchQuery).lean();
  
  // Wait for both promises to resolve
  Promise.all([userPromise, reservationPromise])
      .then(function([user_data, reservation_data]){
          resp.render('user-profile',{
              layout: 'user-index',
              title: 'User Profile',
              style: '/common/user-style.css',
              script: '/common/user-profile.js',
              currentUser: user_data,
              reservationData: reservation_data
          });
      })
      .catch(responder.errorFn());
});

server.get('/lab-profile', function(req, resp){
  const searchQuery = {};
 
  responder.reservationModel.find(searchQuery).lean().then(function(reservation_data){
    const lab = [...new Set(reservation_data.map(reservation => reservation.laboratory))];
    const startTime = [...new Set(reservation_data.map(reservation => reservation.start_time))];
    const endTime = [...new Set(reservation_data.map(reservation => reservation.end_time))];
      
    console.log(searchQuery);
    resp.render('lab-profile', {
      layout: 'user-index',
      title: 'Lab Profile',
      style: '/common/lab-style.css',
      script: '/common/lab-profile.js',
      upcomingReservations: reservation_data,
      lab: lab, 
      startTime: startTime, 
      endTime: endTime, 
      viewReservation: reservation_data 
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

const chem_rooms = '[{"room": "V101"}, {"room": "V102"},{"room": "V103"},{"room": "V104"},{"room": "V105"}]';
const comp_rooms = '[{"room": "G302"},{"room": "G303"},{"room": "G304"},{"room": "G305"}]';
const elec_rooms = '[{"room": "G403"}, {"room": "G404"}]';

let chem_list = JSON.parse(chem_rooms);
let comp_list = JSON.parse(comp_rooms);
let elec_list = JSON.parse(elec_rooms);


server.get('/slot-reservation/:lab', function(req, resp){
  //need student id
  //note that time should be in military format for easier checking
  //the reservations that you have to show have to be within range
  let isChem = req.params.lab === 'Chemistry Laboratory';
  let isComp = req.params.lab === 'Computer Laboratory';
  let isElec = req.params.lab === 'Electronics Laboratory';
  let style = "";
  let room = "";
  if (isChem){
    style = '/common/slot-style-chem.css';
    room = chem_list; 
  }else if (isComp){
    style = "/common/slot-style-comp.css";
    room = comp_list; 
  }else{
    style = "/common/slot-style-elec.css";
    room = elec_list;
  } 
  
  resp.render('slot-reservation',{
    layout: 'slot-index',
    title: req.params.lab,
    style: style, 
    script: '/common/slot-script.js',
    lab: req.params.lab,
    isChem: isChem,
    isComp: isComp, 
    isElec: isElec,
    rooms: room
  });

});

server.post('/slot-ajax', function(req, resp){

  let date = req.body.date; 
  let room = String(req.body.room);
  let start_time_input = req.body.start_time; 
  let end_time_input = req.body.end_time; 

  console.log("Start time (node): " + start_time_input); 
  console.log("End time (node): " + end_time_input); 
  const searchQuery = {
    room: room,
    start_time: {$gte: start_time_input},
    end_time: {$lte: end_time_input}
  }
  responder.reservationModel.find(searchQuery).lean().then(function(reservations){
    if (reservations){
      console.log("Found"); 
      console.log(reservations);
      resp.send(reservations);
    }else{
      console.log("Not found"); 
      resp.status(404).send("Reservation not found");
    }
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
const searchQuery = {
        reservation_id: req.query.reservation_id,
        time_start: req.query.start_time
    };

    // Assuming you have a reservationModel schema/model
    responder.reservationModel.findOne(searchQuery).lean().then(function(details_data){
        if (details_data) {
            // If reservation details are found in the database, render the page with the retrieved data
            resp.render('reservation-details',{
                layout: 'index',
                title: 'Reservation Details',
                style: '/common/receipt-style.css',
                details: details_data
            });
        } else {
            // If reservation details are not found, handle the error or display a message
            resp.status(404).send('Reservation not found');
        }
    }).catch(function(err){
        // Handle errors
        console.error(err);
        resp.status(500).send('Internal Server Error');
    });
});

process.on('SIGTERM',responder.finalClose);  //general termination signal
process.on('SIGINT', responder.finalClose);   //catches when ctrl + c is used
process.on('SIGQUIT', responder.finalClose); //catches other termination commands

const port = process.env.PORT | 3000;
server.listen(port, function(){
  console.log('Listening at port '+port);
});
