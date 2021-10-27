
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
    error: false,
    tabTitle: 'Junk Droor | Sign Up',
    currentUser: req.session.currentUser
  });
});

// Create New User route
users.post('/', isntAuthenticated, (req, res) => {
  User.find({}, 'username -_id', (err, allUsers) => {
    const usernames = allUsers.map(user => user.username);
    if (usernames.includes(req.body.username)) {
      res.render('users/signup.ejs', {
        error: 'User name already taken',
        tabTitle: 'Junk Droor | Sign Up',
        currentUser: req.session.currentUser
      });
    } else {
      req.body.password = bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10));
      User.create(req.body, (err, createdUser) => {
        res.redirect('/');
      });
    }
  });
});

// Log in route
users.get('/login', isntAuthenticated, (req, res) => {
  res.render('users/login.ejs', {
    error: false,
    tabTitle: 'Junk Droor | Log In',
    currentUser: req.session.currentUser
  });
});

// Authenticate route
users.post('/login', isntAuthenticated, (req, res) => {
  User.findOne({ username: req.body.username }, (err, foundUser) => {
    if (err) {
      res.render('users/login.ejs', {
        error: 'There was a database error. Please try again',
        tabTitle: 'Junk Droor | Log In',
        currentUser: req.session.currentUser
      });
    } else if (!foundUser) {
      res.render('users/login.ejs', {
        error: 'User name not found',
        tabTitle: 'Junk Droor | Log In',
        currentUser: req.session.currentUser
      });
    } else {
      if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        req.session.currentUser = foundUser;
        res.redirect('/');
      } else {
        res.render('users/login.ejs', {
          error: 'Password incorrect',
          tabTitle: 'Junk Droor | Log In',
          currentUser: req.session.currentUser
        });
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
