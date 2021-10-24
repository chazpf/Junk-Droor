const bcrypt = require('bcrypt');
const express = require('express');
const items = express.Router();
const Drawer = require('../models/drawers.js');
const Item = require('../models/items.js');

const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    return next()
  } else {
    res.redirect('/users/login')
  }
};

// Edit route
items.get('/:id/edit', isAuthenticated, (req, res) => {
  const {id} = req.params;
  Drawer.find({_id: {$in: req.session.currentUser.drawers}}, (err, foundDrawers) => {
    Item.findById(id, (err, foundItem) => {
      res.render('edit_item.ejs', {
        item: foundItem,
        oldDrawer: foundItem.drawer,
        drawers: foundDrawers,
        tabTitle: `Junk Droor | Edit: ${foundItem.name}`,
        currentUser: req.session.currentUser
      });
    });
  });
});

// Create route
items.post('/', isAuthenticated, (req, res) => {
  Item.create(req.body, (err, createdItem) => {
    Drawer.findByIdAndUpdate(req.body.drawer, {$push: {items: createdItem._id}}, {new: true}, (err, updatedDrawer) => {
      res.redirect(`/drawers/${updatedDrawer._id}`);
    });
  });
});

// Update route
items.put('/:id', isAuthenticated, (req, res) => {
  const {id} = req.params;
  const {drawer, oldDrawer} = req.body;
  delete req.body.oldDrawer;
  Item.findByIdAndUpdate(id, req.body, {new: true}, (err, updatedItem) => {
    if (drawer !== oldDrawer) {
      Drawer.findByIdAndUpdate(oldDrawer, {$pull: {items: updatedItem._id}}, {new:true}, (err, updatedDrawer) => {});
      Drawer.findByIdAndUpdate(drawer, {$push: {items: updatedItem._id}}, {new:true}, (err, updatedDrawer) => {});
    }
    res.redirect(`/drawers/${updatedItem.drawer}`);
  });
});

module.exports = items;
