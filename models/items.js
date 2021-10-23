const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = Schema({
  name: { type: String, required: true },
  drawer: { type: String, required: true },
  tags: [String]
})

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
