const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret); // sub = subject, iat = issued at time
}

exports.signin = function(req, res, next) {
  // User has already had their email and password auth'd
  // we just need to give them a token
  res.send({ token: tokenForUser(req.user), userId: req.user._id  }); // req.user is available from the done callback in the localLogin
};

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  if (!email || !password) {
    return res
      .status(422)
      .send({ error: 'You must provide an email and a password' });
  }

  User.findOne({ email: email }, function(err, existingUser) {
    if (err) {
      return next(err);
    }

    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }

    const user = new User({
      email: email,
      password: password,
      name: name
    });
    user.save(function(err) {
      if (err) {
        return next(err);
      }

      res.json({ token: tokenForUser(user), userId: user._id });
    });
  });
};
