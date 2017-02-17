const express = require('express');
const router = express.Router();

const Authentication = require('../controllers/authentication');
const Votes = require('../controllers/votes');
const passportService = require('../services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

router.get('/:userId', requireAuth, function(req, res) {
  res.send({ message: 'secret content' });
});
router.get('/:userId/votes', requireAuth, Votes.getVotes);
router.post('/:userId/signin', requireSignin, Authentication.signin);
router.post('/signup', Authentication.signup);
router.post('/:userId/votes/add', requireAuth, Votes.createVote);
router.post('/:userId/votes/vote', requireAuth, Votes.vote);


module.exports = router;
