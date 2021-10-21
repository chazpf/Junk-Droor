const bcrypt = require('bcrypt');
const express = require('express');
const sessions = express.Router();
const User = require('../models/users.js');

// const isntAuthenticated = (req, res, next) => {
//   if (!req.session.currentUser) {
//     return next()
//   } else {
//     res.redirect('/products')
//   }
// };
//
// const isAuthenticated = (req, res, next) => {
//   if (req.session.currentUser) {
//     return next()
//   } else {
//     res.redirect('/sessions/new')
//   }
// };

// Show Login route
sessions.get('/login', (req, res) => {
  res.render('users/login.ejs', {
    tabTitle: 'Login',
    currentUser: req.session.currentUser
  });
});

// Create session route
sessions.post('/', (req, res) => {
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
sessions.delete('/', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

//////
module.exports = sessions;
