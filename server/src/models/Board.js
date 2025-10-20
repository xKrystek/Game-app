const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
  0: String,
  1: String,
  2: String,
  3: String,
  4: String,
  5: String,
  6: String,
  7: String,
  8: String
});

const Board = mongoose.models.boards || mongoose.model('boards', BoardSchema);

module.exports = Board;
