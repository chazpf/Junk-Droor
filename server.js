// Dependencies
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const session = require('express-session');

// Configuration
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const db = mongoose.connection;

// Database Connection
mongoose.connect(MONGODB_URI);
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

//Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
  })
);

// Controllers
const userController = require('./controllers/users.js')
app.use('/users', userController);
const sessionController = require('./controllers/sessions.js')
app.use('/sessions', sessionController);

// Routes
app.get('/' , (req, res) => {
  res.render('index.ejs', {
    currentUser: req.session.currentUser,
    tabTitle: 'Junk Droor'
  });
});

//Listener
app.listen(PORT, () => console.log( 'Listening on port:', PORT));
