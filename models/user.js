const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

mongoose.connect("mongodb://admin:admin@ds137435.mlab.com:37435/vote");

var userSchema = mongoose.Schema({
    email : {
        type: String,
        required: true
    },

    username : {
        type: String,
        required: true
    },

    password : {
        type: String,
        required: true
    },

    date : {
        type: Date,
        default : Date.now()
    }
});

userSchema.pre('save', function(next) {
    let user = this;
    if(!user.isModified('password')) {
      return next();
    }
    bcrypt.genSalt(10, function(err, salt) {
      if(err) return next();
      bcrypt.hash(user.password, salt, function(err, hashed) {
        if(err) return next();
        user.password = hashed;
        return next();
      });
    });
  });

userSchema.methods.comparePasswords = function(guess, password, callback) {
    bcrypt.compare(guess, password, function(err, isMatch) {
      return callback(err, isMatch);
    });
}

var User = mongoose.model("user", userSchema, "users");
module.exports = User;