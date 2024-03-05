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
  resp.render('lab-profile',{
      layout: 'user-index',
      title: 'Lab Profile',
      style: '/common/lab-style.css',
      script: '/common/lab-profile.js'
  });
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