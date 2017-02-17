const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const voteSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  groupId: { type: String, default: null },
  answers: [{ text: String, votes: { type: Number, default: 0 } }],
  endsIn: {
    type: Date,
    min: Date.now
  },
  createdAt: { type: Date, default: Date.now }
});

const ModelClass = mongoose.model('vote', voteSchema);

module.exports = ModelClass;
