const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const drawerSchema = Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  owner: { type: String, required: true },
  items: []
})

const Drawer = mongoose.model('Drawer', drawerSchema);

module.exports = Drawer;
