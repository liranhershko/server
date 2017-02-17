const Vote = require('../models/vote');
const User = require('../models/user');
const uuid = require('node-uuid');

module.exports = {
  createVote: function(req, res, next) {
    User.findOne({ _id: req.params.userId }, function(err, existingUser) {
      const vote = new Vote({
        title: req.body.title,
        author: existingUser.name,
        groupId: req.body.private ? uuid.v4() : null,
        answers: req.body.answers.map(a => {
          return { text: a };
        })
      });

      vote.save(function(err) {
        if (err) {
          return next(err);
        }

        res.json(vote);
      });
    });
  },
  vote: function(req, res, next) {
    const voteId = req.body.voteId;
    const answerId = req.body.answerId;

    Vote.findById(voteId, function(err, vote) {
      const answers = vote.answers;
      answers.forEach(item => {
        if (item._id.toString() === answerId) {
          item.votes += 1;
        }
      });
      vote.answers = answers;
      vote.save(function(err, updatedVote) {
        res.send(updatedVote);
      });
    });
  },
  getVotes: function(req, res, next) {
    User.findOne({ _id: req.params.userId }, function(err, existingUser) {
      Vote.find({
        $or: [{ groupId: null }, { groupId: { $in: existingUser.groups } }]
      }).then(votes => {
        res.send(votes);
      });
    });
  }
};
