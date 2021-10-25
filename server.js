// Dependencies
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const session = require('express-session');
const Drawer = require('./models/drawers.js');
const Item = require('./models/items.js');

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
const drawerController = require('./controllers/drawers.js')
app.use('/drawers', drawerController);
const itemController = require('./controllers/items.js')
app.use('/items', itemController);

// Routes
app.get('/' , (req, res) => {
  if (req.session.currentUser) {
    if (req.query.search) {
      const search = req.query.search;
      Item.find({name: search, drawer: {$in: req.session.currentUser.drawers}}, 'drawer -_id', (err, foundItems) => {
        if (foundItems.length === 1) {
          Drawer.findById(foundItems[0].drawer, (err, foundDrawer) => {
            res.redirect(`/drawers/${foundDrawer._id}`);
          });
        } else if (foundItems.length > 1) {
          const drawers = foundItems.map(item => item.drawer);
          Drawer.find({_id: {$in: drawers}}, (err, foundDrawers) => {
            res.render('index.ejs', {
              searchResult: 'Item found in multiple drawers:',
              drawers: foundDrawers,
              currentUser: req.session.currentUser,
              tabTitle: 'Junk Droor'
            });
          });
        } else {
          Drawer.find({_id: {$in: req.session.currentUser.drawers}}, (err, foundDrawers) => {
            res.render('index.ejs', {
              searchResult: 'Item not found in any drawer.',
              drawers: foundDrawers,
              currentUser: req.session.currentUser,
              tabTitle: 'Junk Droor'
            });
          });
        }
      });
    } else {
      Drawer.find({_id: {$in: req.session.currentUser.drawers}}, (err, foundDrawers) => {
        res.render('index.ejs', {
          searchResult: false,
          drawers: foundDrawers,
          currentUser: req.session.currentUser,
          tabTitle: 'Junk Droor'
        });
      })
    }
  } else {
    res.render('index.ejs', {
      tabTitle: 'Junk Droor',
      currentUser: req.session.currentUser,
    });
  }
});

//Listener
app.listen(PORT, () => console.log( 'Listening on port:', PORT));
