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
  if (req.body.qty < 0) req.body.qty = 0;
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
  if (req.body.qty < 0) {
    req.body.qty = 0;
  }
  Item.findByIdAndUpdate(id, req.body, {new: true}, (err, updatedItem) => {
    if (drawer !== oldDrawer) {
      Drawer.findByIdAndUpdate(oldDrawer, {$pull: {items: updatedItem._id}}, {new:true}, (err, updatedDrawer) => {
        if (err) return res.send('Drawer update error: ' + err);
        Drawer.findByIdAndUpdate(drawer, {$push: {items: updatedItem._id}}, {new:true}, (err, updatedDrawer) => {
          if (err) return res.send('Drawer update error: ' + err);
          res.redirect(`/drawers/${updatedItem.drawer}`);
        });
      });
    } else {
      res.redirect(`/drawers/${updatedItem.drawer}`);
    }
  });
});

// Destroy route
items.delete('/:id', (req, res) => {
  const {id} = req.params;
  Item.findByIdAndDelete(id, (err, deletedItem) => {
    if (err) return res.send('Item deletion error: ' + err);
    Drawer.findByIdAndUpdate(deletedItem.drawer, {$pull: {items: deletedItem._id}}, {new: true}, (err, updatedDrawer) => {
      if (err) return res.send('Error removing Drawer from User: ' + err);
      res.redirect(`/drawers/${updatedDrawer._id}`);
    });
  });
});

//////
module.exports = items;
