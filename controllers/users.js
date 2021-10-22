
const bcrypt = require('bcrypt');
const express = require('express');
const users = express.Router();
const User = require('../models/users.js');

const isntAuthenticated = (req, res, next) => {
  if (!req.session.currentUser) {
    return next()
  } else {
    res.redirect('/')
  }
};

const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    return next()
  } else {
    res.redirect('/users/login')
  }
};

// Sign up route
users.get('/signup', isntAuthenticated, (req, res) => {
  res.render('users/signup.ejs', {
    tabTitle: 'Junk Droor | Sign Up',
    currentUser: req.session.currentUser
  });
});

// Create New User route
users.post('/', isntAuthenticated, (req, res) => {
  req.body.password = bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10));
  req.body.drawers = [];
  User.create(req.body, (err, createdUser) => {
    res.redirect('/');
  });
});

// Log in route
users.get('/login', isntAuthenticated, (req, res) => {
  res.render('users/login.ejs', {
    tabTitle: 'Junk Droor | Log In',
    currentUser: req.session.currentUser
  });
});

// Authenticate route
users.post('/login', isntAuthenticated, (req, res) => {
  User.findOne({ username: req.body.username }, (err, foundUser) => {
    if (err) {
      console.log(err);
      res.send('There was a database error');
    } else if (!foundUser) {
      res.send('Username not found');
    } else {
      if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        req.session.currentUser = foundUser;
        res.redirect('/');
      } else {
        res.send('Password incorrect');
      }
    }
  });
});

// Log out route
users.delete('/session', isAuthenticated, (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

//////
module.exports = users;