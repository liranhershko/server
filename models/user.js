const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  name: String,
  groups: Array
});

// on save hook, encrypt password
// before saving a model, run this function
userSchema.pre('save', function(next) {
  const user = this;

  // generating salt then run callback
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }

    // hash our password using the salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return newxt(err);
      }

      // overwrite plain text password with encrypted password
      user.password = hash;

      // go and save the model
      next();
    });
  });
});

// when we are creating a user object,
// we will be able to use any functions that are defined in the methods property
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }

    callback(null, isMatch);
  });
};

const ModelClass = mongoose.model('user', userSchema);

module.exports = ModelClass;
