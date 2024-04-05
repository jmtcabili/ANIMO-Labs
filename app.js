//npm i express express-handlebars body-parser mongodb mongoose jquery express-session mongoose connect-mongodb-session
//npm install multer
//npm install bcrypt
//npm install express-validator

const express = require('express');
const server = express();
const mongoURI = "mongodb://localhost:27017/labDB"; //replace with the right link (was testing it on local)

const bodyParser = require('body-parser');
server.use(express.json()); 
server.use(express.urlencoded({ extended: true }));

const handlebars = require('express-handlebars');
server.set('view engine', 'hbs');
server.engine('hbs', handlebars.engine({
    extname: 'hbs',
}));

server.use(express.static('public'));

const session = require('express-session');
const mongoStore = require('connect-mongodb-session')(session);

server.use(session({
  secret: 'a secret fruit',
  saveUninitialized: true, 
  resave: false,
  store: new mongoStore({ 
    uri: mongoURI,
    collection: 'Sessions',
    expires: 1000*60*60 // 1 hour
  })
}));

const responder = require('./models/responder');
const bcrypt = require('bcrypt');
const multer = require('multer');

const fs = require('fs').promises;

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
      cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

const {body, validationResult} = require('express-validator');


server.get('/', function(req, resp){
  resp.render('login',{
      layout: 'index',
      title: 'Login Page',
      style: '/common/login-style.css',
      isInvalid: 0
  });
});

let current_user = {name: "", id: 0, type: "", desc: "", image: Buffer.from("")};
let reservationInstance = []; 
let updateInstance = []; 
let userSessionID = 0;

server.post('/login', [
  body('user_id').notEmpty().withMessage('User ID is required').isNumeric().withMessage('User ID must contain only numbers'),
  body('password').notEmpty().withMessage('Password is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('login', {
      layout: 'index',
      title: 'Login Page',
      style: '/common/login-style.css',
      isInvalid: 1,
      errors: errors.array()
    });
  }

  const { user_id, password } = req.body;
  console.log(user_id, password);
  responder.userModel.findOne({ user_id })
      .then(async (user) => {
          if (!user) {
              res.render('login', { 
                layout: 'index',
                title: 'Login Page',
                style: '/common/login-style.css',
                isInvalid: 1,
                message: 'User ID not found'
              });
          } else {
              const match = await bcrypt.compare(password, user.password);
              if (match) {
                  current_user.name = user.name;
                  current_user.id = user.user_id; 
                  current_user.type = user.acc_type; 
                  current_user.desc = user.desc; 
                  if(user.image){
                    current_user.image = user.image.toString('base64');
                  }
                  else{
                    current_user.image = user.image;
                  }
                  if (user.acc_type === 'student') {
                      req.session.login_user = user.user_id;
                      req.session.login_id = req.sessionID;
                      userSessionID = req.session.login_user;
                      res.redirect('/user-profile/' + user_id);
                  } else if (user.acc_type === 'lab-administrator') {
                      req.session.login_user = user.user_id;
                      req.session.login_id = req.sessionID;
                      userSessionID = req.session.login_user;
                      res.redirect('/lab-profile/' + user_id);
                  }
              } else {
                  res.render('login', { 
                    layout: 'index',
                    title: 'Login Page',
                    style: '/common/login-style.css',
                    isInvalid: 1,
                    message: 'Incorrect password'
                  });
              }
          }
      })
      .catch(err => {
          console.error(err);
          res.status(500).send('Server error');
      });
});

server.get('/sign-up', function(req, resp){
  resp.render('sign-up',{
      layout: 'index',
      title: 'Sign Up',
      style: '/common/signup-style.css'
  });
});

server.post('/sign-up', [
  body('name')
    .notEmpty().withMessage('Name is required')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name must contain letters and spaces only'),
  body('user_id')
    .notEmpty().withMessage('User ID is required')
    .isNumeric().withMessage('User ID must contain only numbers')
    .isLength({ min: 6, max: 6 }).withMessage('User ID must be 6 digits'),
  body('acc_type').notEmpty().withMessage('Account type is required'),
  body('password')
    .notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('sign-up', { 
      layout: 'index',
      title: 'Sign Up',
      style: '/common/signup-style.css',
      isInvalid: 1,
      errors: errors.array()
    });
  }

  try {
    const existingUser = await responder.userModel.findOne({ user_id: req.body.user_id });
    if (existingUser) {
      return res.render('sign-up', {
        layout: 'index',
        title: 'Sign Up',
        style: '/common/signup-style.css',
        isInvalid: 1,
        errors: [{ msg: 'User ID is already taken' }]
      });
    }

    const newUser = new responder.userModel({
      name: req.body.name,
      user_id: req.body.user_id,
      acc_type: req.body.acc_type,
      password: await bcrypt.hash(req.body.password, 10),
      image: req.body.image,
      desc: req.body.desc
    });

    await newUser.save();
    res.render('login', { 
      layout: 'index',
      title: 'Login Page',
      style: '/common/login-style.css'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error signing up.');
  }
});


function checkUserId(req, res, next) {
  const requestedUserId = req.params.id;
  const sessionUserId = req.session.login_user;

  if (requestedUserId === sessionUserId) {
      next(); // User ID matches, proceed to the route handler
  } else {
      res.redirect('/'); // Redirect to back to login
  }
}

server.post('/logout', (req, res) => {
  req.session.destroy(err => {
      if (err) {
          console.error('Error destroying session:', err);
          res.status(500).send('Failed to log out');
      } else {
          res.status(200).send('Logged out successfully');
      }
  });
});

server.get('/user-profile/:id/', checkUserId, function(req, resp){
  const searchQuery = { student_id: req.params.id }; 
  
  // Fetch user data
  const userPromise = responder.userModel.find(searchQuery).lean();
    
  // Fetch reservation data
  const reservationPromise = responder.reservationModel.find(searchQuery).lean();
  const searchTech = {acc_type: "lab-administrator"};
  const techPromise = responder.userModel.find(searchTech).lean();
  // Wait for both promises to resolve
  Promise.all([userPromise, reservationPromise, techPromise])
      .then(function([user_data, reservation_data, tech_data]){
        
        const lab = [...new Set(reservation_data.map(reservation => reservation.laboratory))];
        const startTime = [...new Set(reservation_data.map(reservation => reservation.start_time))];
        const endTime = [...new Set(reservation_data.map(reservation => reservation.end_time))];
        const studentID = [...new Set(reservation_data.map(reservation => reservation.student_id))];

        console.log(studentID);
        console.log(current_user.name);
        resp.render('user-profile',{
            layout: 'user-index',
            title: 'User Profile',
            style: '/common/user-style.css',
            script: '/common/user-profile.js',
            currentUser: current_user,
            reservationData: reservation_data,
            techUsers: tech_data,
            studentID: studentID,
            lab: lab, 
            startTime: startTime, 
            endTime: endTime, 
        });
      })
      .catch(responder.errorFn());
});

server.get('/deactivate-account/:id', function(req, resp){
  const userId = req.params.id;
  let userPromise = responder.userModel.deleteOne({ user_id: userId });
  let reservationPromise = responder.reservationModel.deleteMany({ student_id: userId });

  Promise.all([userPromise, reservationPromise])
    .then(() => {
      console.log(`Account with ID ${userId} has been deactivated.`);
      console.log(`Reservations with ${userId} have been deleted.`);
      resp.redirect('/');
    })
    .catch(err => {
      console.error(`Error deactivating account or reservations: ${err}`);
      resp.status(500).send('Failed to deactivate account or delete reservations.');
    });
});

server.get('/delete-reservation/:id', function(req, resp){
  const reservationId = req.params.id;
  responder.reservationModel.deleteOne({ reservation_id: reservationId })
  .then(() => {
    console.log(`Reservation with ID ${reservationId} has been deleted.`);
    resp.redirect('/');
  })
  .catch(err => {
    console.error(`Error deletiong reservation: ${err}`);
    resp.status(500).send('Failed to delete reservation.');
  });
});

server.get('/lab-profile/:id/', checkUserId, function(req, resp){
  const searchQuery = {};
  const searchStudent = {acc_type: "student"};
  const studentPromise = responder.userModel.find(searchStudent).lean();
  const reservationPromise = responder.reservationModel.find(searchQuery).lean();

  Promise.all([reservationPromise, studentPromise])
  .then(function([reservation_data, student_data]){
    
    const lab = [...new Set(reservation_data.map(reservation => reservation.laboratory))];
    const startTime = [...new Set(reservation_data.map(reservation => reservation.start_time))];
    const endTime = [...new Set(reservation_data.map(reservation => reservation.end_time))];
      
    resp.render('lab-profile', {
      layout: 'user-index',
      title: 'Lab Profile',
      style: '/common/lab-style.css',
      script: '/common/lab-profile.js',
      currentUser: current_user,
      upcomingReservations: reservation_data,
      studentUsers: student_data,
      lab: lab, 
      startTime: startTime, 
      endTime: endTime, 
      viewReservation: reservation_data 
    });
  }).catch(responder.errorFn());
});

server.post('/view-filter', function(req, res) {
  const id = req.body.student_id;
  const lab = req.body.laboratory;
  const start = req.body.start_time;
  const end = req.body.end_time;
  
  console.log(req.body);
  
  const searchQuery = {};
  if(id){
      searchQuery.student_id = id;
  }
  if (lab) {
      searchQuery.laboratory = lab;
  }
  if (start) {
      searchQuery.start_time = start;
  }
  if (end) {
    searchQuery.end_time = end;
  }
  console.log(searchQuery);
  // Find reservations based on the constructed query
  responder.reservationModel.find(searchQuery).lean().then(function(filteredData) {
      // Send back the filtered data as JSON response
      res.json(filteredData);
  }).catch(function(err) {
      // Handle errors appropriately
      console.error('Error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
  });
});

server.post('/update-profile', upload.single('image'), async function(req, res) {
  const userID = req.body.id; // Assuming 'id' is the field name in your FormData for user ID
  const oldPassword = req.body.oldPassword; // Assuming 'password' is the field name for old password
  const newPassword = req.body.newPassword; // Assuming 'newPassword' is the field name for new password
  console.log(req.file);
  try {
    // Find the user by their ID
    const user = await responder.userModel.findOne({ user_id: userID });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    if (req.body.name){
      user.name = req.body.name;
      await user.save();
    } 
    if (req.body.desc){
      user.desc = req.body.desc;
      await user.save();
    } 
    if (req.file) {
      try {
        // Read the file as a buffer
        const fileBuffer = await fs.readFile(req.file.path);
    
        // Assign the buffer to the user's image field
        user.image = fileBuffer;
    
        // Save the user object with the updated image field
        await user.save();
      } catch (error) {
        console.error('Error reading file:', error);
        // Handle the error appropriately, e.g., send an error response
        return res.status(500).json({ message: 'Internal server error.' });
      }
    }
    if (oldPassword && oldPassword !== user.password) {
      return res.status(403).json({ message: 'Old password incorrect. Update failed.' });
    }
    else{
      if (newPassword) user.password = newPassword;
      await user.save();
    }

    res.status(200).json({ message: 'Data updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});
    
server.get('/lab-selection', function(req, resp){
  if(req.session.login_id == undefined){
    resp.redirect('/');
    return;
  }
  let isStudent = 0, isLabTech = 0; 
  if (current_user.type === 'student')
    isStudent = 1;
  else if (current_user.type === 'lab-administrator')
    isLabTech = 1;
  resp.render('lab-selection',{
      layout: 'selection-index',
      title: 'Lab Selection',
      style: '/common/selection-style.css',
      current_user: current_user,
      isStudent: isStudent, 
      isLabTech: isLabTech
  });
});

const chem_rooms = '[{"room": "V101"}, {"room": "V102"},{"room": "V103"},{"room": "V104"},{"room": "V105"}]';
const comp_rooms = '[{"room": "G302"},{"room": "G303"},{"room": "G304"},{"room": "G305"}]';
const elec_rooms = '[{"room": "G403"}, {"room": "G404"}]';

let chem_list = JSON.parse(chem_rooms);
let comp_list = JSON.parse(comp_rooms);
let elec_list = JSON.parse(elec_rooms);

let isChem = 0, isComp = 0, isElec = 0; 
server.get('/slot-reservation/:lab', function(req, resp){
  if(req.session.login_id == undefined){
    resp.redirect('/');
    return;
  }
  //create new intsance whenever slot-reservation is reached
  reservationInstance = responder.reservationModel({
    name: "", 
    reservation_id: "", 
    student_id: "",
    laboratory: "", 
    room: "", 
    date: "", 
    start_time: "", 
    end_time: "", 
    seat_ids: [""], 
    equipment: [""]
  });

  //note that time should be in military format for easier checking
  //the reservations that you have to show have to be within range
  isChem = req.params.lab === 'Chemistry Laboratory';
  isComp = req.params.lab === 'Computer Laboratory';
  isElec = req.params.lab === 'Electronics Laboratory';
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

server.get('/update-reservation/:lab/:id', function(req, resp){
  if(req.session.login_id == undefined){
    resp.redirect('/');
    return;
  }
  const searchQuery = {reservation_id: req.params.id}; 
  responder.reservationModel.findOne(searchQuery).lean().then(function(reservation){
    updateInstance = reservation; 
  });
  
  console.log("Update RI: " + reservationInstance); 
  //need student id
  //note that time should be in military format for easier checking
  //the reservations that you have to show have to be within range
  isChem = req.params.lab === 'Chemistry Laboratory';
  isComp = req.params.lab === 'Computer Laboratory';
  isElec = req.params.lab === 'Electronics Laboratory';
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
    rooms: room,
    isUpdate: 1,
    id: req.params.id,
    student_id: current_user.id,
    isLab: current_user.type === 'lab-administrator'
  });

});


server.post('/slot-ajax', function(req, resp){

  let date = String(req.body.date); 
  let room = String(req.body.room);
  let start_time_input = Number(req.body.start_time); 
  let end_time_input = Number(req.body.end_time); 

  //console.log(date);

  //console.log("Start time (node): " + start_time_input); 
  //console.log("End time (node): " + end_time_input); 
  const searchQuery = {
    room: room,
    date: date
  };

  responder.reservationModel.find(searchQuery).lean().then(function(reservations){

    //filter reservations
    let reserved = new Array(); 

    for (let i = 0; i < reservations.length; i++){
      let runner = start_time_input; 
      let end = end_time_input; 
      let inRange = 0;
      while (!inRange && runner <= end){
        if (runner > reservations[i].start_time && runner < reservations[i].end_time){
          inRange = 1; 
        }else{
          if (runner % 100 == 45)
            runner += 55; 
          else 
            runner += 15; 
        }
        if (inRange){
          reserved.push(reservations[i])
        }
      }
    } 
    if (reservations){
      resp.send(reserved);
    }else{
      resp.status(404).send("Reservation not found");
    }
  });
});

server.post('/slot-update-ajax', function(req, resp){

  let date = String(req.body.date); 
  let room = String(req.body.room);
  
  let start_time_input = Number(req.body.start_time); 
  let end_time_input = Number(req.body.end_time); 

  //get id
  let id = String(req.body.id);

  const searchQuery = {
    room: room,
    date: date
  };

  responder.reservationModel.find(searchQuery).lean().then(function(reservations){

    //filter reservations
    let reserved = new Array(); 

    for (let i = 0; i < reservations.length; i++){
      let runner = start_time_input; 
      let end = end_time_input; 
      let inRange = 0;
      while (!inRange && runner <= end && id != reservations[i].reservation_id){
        if (runner > reservations[i].start_time){
          inRange = 1; 
        }else{
          if (runner % 100 == 45)
            runner += 55; 
          else 
            runner += 15; 
        }
        if (inRange){
          reserved.push(reservations[i])
        }
      }
    } 
    if (reservations){
      resp.send(reserved);
    }else{
      resp.status(404).send("Reservation not found");
    }
  });
});


const chem_eq = '[{"item": "Beaker (100 mL)"}, {"item": "Erlenmyer Flask"},{"item": "Bunsen Burner"}]';
const comp_eq = '[{"item": "LAN Cable"},{"item": "HDMI Cable"},{"item": "USB (128 GB)"}, {"item": "Keyboard"}]';
const elec_eq = '[{"item": "VOM"}, {"item": "Oscilloscope"}, {"item": "Wire Stripper"}]';

let chem_eq_list = JSON.parse(chem_eq);
let comp_eq_list = JSON.parse(comp_eq);
let elec_eq_list = JSON.parse(elec_eq);

server.post('/add-equipment', [
  body('seats')
  .isLength({ min: 1})
  .withMessage("No seats selected")
],function(req, resp){


  if(req.session.login_id == undefined){
    resp.redirect('/');
    return;
  } //unsure if this is the right place to put this code TODO: please double check 


  let eq_list = "", lab = "";
  if (isChem){
    eq_list = chem_eq_list;
    lab = "Chemistry";
    style = '/common/slot-style-chem.css';
    room = chem_list;
  }
  else if (isComp){
    eq_list = comp_eq_list;
    lab = "Computer";
    style = '/common/slot-style-chem.css';
    room = chem_list;
  } 
  else{ 
    eq_list = elec_eq_list;
    lab = "Electrical";
    style = '/common/slot-style-chem.css';
    room = chem_list;
  } 
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()){
    console.log("List of errors: " + errors); 
    resp.redirect("/slot-reservation/"+lab + " Laboratory");
  }
  //pre-processing time and seats

  //Time 
  console.log(req.body);
  console.log(req.body.start_hour); 
  let start_hour = Number(req.body.start_hour);
  let start_min = Number(req.body.start_min);
  let end_hour = Number(req.body.end_hour);
  let end_min = Number(req.body.end_min);

  console.log(start_hour); 
  if (String(req.body.start_period) === 'AM' && start_hour == 12)
    start_hour = 0; 
  if (String(req.body.end_period) === 'AM' && end_hour == 12)
    end_hour = 0; 

  if (String(req.body.start_period) === 'PM' && start_hour != 12)
    start_hour += 12;    
  if (String(req.body.end_period) === 'PM' && end_hour != 12)
    end_hour += 12;

  start_time = String(start_hour*100 + start_min); 
  console.log(start_time); 
  end_time = end_hour*100 + end_min; 

  //seats
  seat_arr = String(req.body.seats).split(" ");
  seat_arr.pop();


  //update reservation instance
  reservationInstance.name = current_user.name;
  reservationInstance.student_id = current_user.id; 
  reservationInstance.room = req.body.room; 
  reservationInstance.date = req.body.date; 
  reservationInstance.start_time = start_time; 
  reservationInstance.end_time = end_time; 
  reservationInstance.seat_ids = seat_arr;

  //submit -> post to save then redirect to receipt

  reservationInstance.laboratory = lab + " Laboratory";
  console.log(reservationInstance);
  resp.render('add-equipment',{
      layout: 'index',
      title: 'Add Equipment',
      style: '/common/equipment-style.css',
      list: eq_list,
      lab: lab
  });

});

server.post('/update-equipment', [
  body('seats')
  .isLength({ min: 1})
  .withMessage("No seats selected")
],function(req, resp){

  if(req.session.login_id == undefined){
    resp.redirect('/');
    return;
  } //unsure if this is the right place to put this code TODO: please double check 

  let eq_list = "", lab = "";
  if (isChem){
    eq_list = chem_eq_list;
    lab = "Chemistry";
    style = '/common/slot-style-chem.css';
    room = chem_list;
  }
  else if (isComp){
    eq_list = comp_eq_list;
    lab = "Computer";
    style = '/common/slot-style-chem.css';
    room = chem_list;
  } 
  else{ 
    eq_list = elec_eq_list;
    lab = "Electrical";
    style = '/common/slot-style-chem.css';
    room = chem_list;
  } 
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()){
    console.log("List of errors: " + errors); 
    resp.redirect("/update-reservation/"+lab + " Laboratory/"+updateInstance.reservation_id);
  }
  //pre-processing time and seats

  //Time 
  console.log(req.body);
  console.log(req.body.start_hour); 
  let start_hour = Number(req.body.start_hour);
  let start_min = Number(req.body.start_min);
  let end_hour = Number(req.body.end_hour);
  let end_min = Number(req.body.end_min);

  console.log(start_hour); 
  if (String(req.body.start_period) === 'AM' && start_hour == 12)
    start_hour = 0; 
  if (String(req.body.end_period) === 'AM' && end_hour == 12)
    end_hour = 0; 

  if (String(req.body.start_period) === 'PM' && start_hour != 12)
    start_hour += 12;    
  if (String(req.body.end_period) === 'PM' && end_hour != 12)
    end_hour += 12;

  start_time = String(start_hour*100 + start_min); 
  console.log(start_time); 
  end_time = end_hour*100 + end_min; 

  //seats
  seat_arr = String(req.body.seats).split(" ");
  seat_arr.pop();


  //update reservation instance
  updateInstance.name = current_user.name;
  updateInstance.student_id = current_user.id; 
  updateInstance.room = req.body.room; 
  updateInstance.date = req.body.date; 
  updateInstance.start_time = start_time; 
  updateInstance.end_time = end_time; 
  updateInstance.seat_ids = seat_arr;

  updateInstance.laboratory = lab + " Laboratory";
  console.log(updateInstance);
  resp.render('add-equipment',{
      layout: 'index',
      title: 'Add Equipment',
      style: '/common/equipment-style.css',
      list: eq_list,
      lab: lab,
      isUpdate: 1
  });

});

server.post('/walk-in', function(req, res) {
  // Find the last reservation and get its ID
  responder.reservationModel.findOne({}).sort({_id: -1}).lean().then(function(last_reservation) {
      const last_id = last_reservation ? last_reservation.reservation_id : 0;
      const new_id = reservationInstance.reservation_id = Number(last_id) +1; 
      // Parse the request body to get reservation data
      console.log(req.body);

      const reservationData = {
          name: req.body.name,
          reservation_id: new_id,
          student_id: req.body.id,
          laboratory: req.body.laboratory,
          room: req.body.room,
          date: req.body.date,
          start_time: parseInt(req.body.start_time),
          end_time: parseInt(req.body.end_time),
          seat_ids: [],
          equipment: [],
      };

      console.log(reservationData);
      
      const newReservation = new responder.reservationModel(reservationData);

      // Save the reservation to the database
      newReservation.save()
          .then(savedReservation => {
              console.log('Reservation saved successfully:', savedReservation);
              // Handle success response or redirect to another page
              res.status(200).send('Reservation saved successfully');
          })
          .catch(error => {
              console.error('Error saving reservation:', error);
              // Handle error response
              res.status(500).send('Error saving reservation');
          });
  });
});

server.post('/receipt', function(req, resp){
  if(req.session.login_id == undefined){
    resp.redirect('/');
    return;
  }
  console.log("RI at receipt: " + reservationInstance); 
  const searchQuery2 = {reservation_id: reservationInstance.reservation_id}; 
  reservationInstance.equipment = [];
  updateInstance.equipment = []; 
  //fetch equipment data
  console.log(req.body);
  for (let item in req.body){
    console.log("item count: " + req.body[item]);
    if (req.body[item] > 0){
      reservationInstance.equipment.push(item);
      updateInstance.equipment.push(item); 
    }
  }
  console.log("in instance: " + reservationInstance.equipment);
  //add equipment data to reservation instance
  

  //save instance to db
  const searchQuery = {};
  if (reservationInstance.reservation_id === ""){
    responder.reservationModel.findOne({}).sort({_id: -1}).lean().then(function(last_reservation){
      last_id = last_reservation.reservation_id;
      reservationInstance.reservation_id = Number(last_id) +1; 
      reservationInstance.save().then(function(){
        responder.reservationModel.findOne({}).sort({_id: -1}).lean().then(function(new_res){
          resp.render('receipt',{
            layout: 'index',
            title: 'receipt',
            style: '/common/receipt-style.css', 
            last: new_res,
            current_user: current_user
          });
        });
      });
    });
  }else{
    console.log("you are updating"); 
    const searchQuery2 = {reservation_id: updateInstance.reservation_id}; 
    responder.reservationModel.findOne(searchQuery2).then(function(result){
      result.room = updateInstance.room; 
      result.date = updateInstance.date; 
      result.start_time = updateInstance.start_time; 
      result.end_time = updateInstance.end_time;
      result.seat_ids = updateInstance.seat_ids; 
      result.equipment = updateInstance.equipment; 
      result.save().then(function(out){
        if (out){
          resp.render('receipt',{
            layout: 'index',
            title: 'receipt',
            style: '/common/receipt-style.css', 
            last: updateInstance,
            current_user: current_user,
            isLab: current_user.type === 'lab-administrator'
          });
        }else{
          console.log("somethign bad happened"); 
        } 
      })
    });
  }  
});


function checkReservationOwnership(req, res, next) {
  const searchQuery = {
      reservation_id: req.query.reservation_id,
      time_start: req.query.start_time
  };

  responder.reservationModel.findOne(searchQuery).lean().then(function(details_data){
      if ((details_data && details_data.student_id === req.session.login_user) || current_user.type === 'lab-administrator') {
          // User is the owner of the reservation, allow access to the route
          next();
      } else {
          // User is not the owner of the reservation, redirect to an error page or perform another action
          res.redirect('/');
      }
  }).catch(function(err){
      // Handle errors
      console.error(err);
      res.status(500).send('Internal Server Error');
  });
}



server.get('/reservation-details', checkReservationOwnership, function(req, resp){
const searchQuery = {
        reservation_id: req.query.reservation_id,
        time_start: req.query.start_time
    };
    
    // Assuming you have a reservationModel schema/model
    responder.reservationModel.findOne(searchQuery).lean().then(function(details_data){
        if (details_data) {
            // If reservation details are found in the database, render the page with the retrieved data
            let isStudent = 0, isLabTech = 0; 
            if (current_user.type === 'student')
              isStudent = 1;
            else if (current_user.type === 'lab-administrator')
              isLabTech = 1;
            resp.render('reservation-details',{
                layout: 'reservation-details',
                script: '/common/reservation-details.js',
                title: 'Reservation Details',
                style: '/common/receipt-style.css',
                details: details_data,
                isStudent: isStudent,
                isLabTech: isLabTech, 
                current_user: current_user
                
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

const port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Listening at port '+port);
});
