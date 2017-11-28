const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User =  require("../models/user");

passport.serializeUser(function(user, done){
    done(null,user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

passport.use("local-login", new LocalStrategy(
    function(username, password, done){
        User.findOne({"username" : username}, function(err, user){
            if(err) return done(err);
            if(!user){
                return done(null, false, "Invalid username");
            }
            else{
                user.comparePasswords(password, user.password, function(err, isMatch){
                    if(err) return done(err);
                    if(!isMatch) return done(null, false, "Invalid password!");
                    return done(null, user, "You have logged in!");
                });
            }
        });
    }
));