
const bcrypt = require('bcrypt');
const express = require('express');
const users = express.Router();
const User = require('../models/users.js');

// const isntAuthenticated = (req, res, next) => {
//   if (!req.session.currentUser) {
//     return next()
//   } else {
//     res.redirect('/')
//   }
// };

// Show signup route
users.get('/signup', (req, res) => {
  res.render('users/signup.ejs', {
    tabTitle: 'Junk Droor | Sign Up',
    currentUser: req.session.currentUser
  });
});

// Create New User route
users.post('/', (req, res) => {
  req.body.password = bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10));
  req.body.drawers = [];
  User.create(req.body, (err, createdUser) => {
    res.redirect('/');
  });
});

//////
module.exports = users;
