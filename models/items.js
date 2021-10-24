const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = Schema({
  name: { type: String, required: true },
  drawer: { type: String, required: true },
  qty: {type: Number, require: true, default: 1, min: 0},
})

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
