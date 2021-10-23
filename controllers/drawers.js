const bcrypt = require('bcrypt');
const express = require('express');
const drawers = express.Router();
const User = require('../models/users.js');
const Drawer = require('../models/drawers.js');

const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    return next()
  } else {
    res.redirect('/users/login')
  }
};

// Show route
drawers.get('/:id', isAuthenticated, (req, res) => {
  const {id} = req.params;
  Drawer.findById(id, (err, foundDrawer) => {
    res.render('drawer.ejs', {
      drawer: foundDrawer,
      tabTitle: `Junk Droor | ${foundDrawer.name}`,
      currentUser: req.session.currentUser
    });
  });
});

// Edit route
drawers.get('/:id/edit', isAuthenticated, (req, res) => {
  const {id} = req.params;
  Drawer.findById(id, (err, foundDrawer) => {
    res.render('edit_drawer.ejs', {
      drawer: foundDrawer,
      tabTitle: `Junk Droor | Edit: ${foundDrawer.name}`,
      currentUser: req.session.currentUser
    });
  });
});

// New route
drawers.get('/new', isAuthenticated, (req, res) => {
  res.render('new_drawer.ejs', {
    tabTitle: 'Junk Droor | Create Drawer',
    currentUser: req.session.currentUser
  });
});

// Create route
drawers.post('/', isAuthenticated, (req, res) => {
  req.body.owner = req.session.currentUser._id;
  req.body.items = [];
  Drawer.create(req.body, (err, createdDrawer) => {
    if (err) res.send('Drawer creation error: ' + err);
    User.findByIdAndUpdate(req.body.owner, {$push: {drawers: createdDrawer._id}}, {new: true}, (err, updatedUser) => {
      if (err) res.send('User update error: ' + err);
      req.session.currentUser = updatedUser;
      res.redirect('/');
    });
  });
});

//////
module.exports = drawers;
