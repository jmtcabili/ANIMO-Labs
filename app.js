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
      style: 'login-style.css'
  });
});

server.get('/sign-up', function(req, resp){
  resp.render('sign-up',{
      layout: 'index',
      title: 'Sign Up',
      style: 'signup-style.css'
  });
});

server.get('/user-profile', function(req, resp){
  resp.render('user-profile',{
      layout: 'user-index',
      title: 'User Profile'
  });
});


const port = process.env.PORT | 3000;
server.listen(port, function(){
  console.log('Listening at port '+port);
});