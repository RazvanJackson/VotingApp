const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");

const app = require("../app");
const User = require("../models/user");

const router = express.Router();

//GET
router.get("/", function(req,res){
    app.locals.showRegisterBtn = true;
    res.render("index");
});

router.get("/signup",function(req,res){
    app.locals.showRegisterBtn = false;
    res.render("signup");
});

router.get("/login",function(req,res){
    app.locals.showRegisterBtn = true;
    res.render("login");
});

router.get("/logout", isLogged, function(req,res){
    req.flash("success", "You have succesful logged out!");
    req.logOut();
    res.redirect("/");
})

router.get("/myaccount", isLogged, function(req,res){
    res.render("myaccount");
})

// POST
router.post("/signup", function(req,res){
    email =  req.body.email;
    username =  req.body.username;
    password =  req.body.password;
    password2 =  req.body.password2;

    req.checkBody("email", "Invalid email adress!").isEmail();
    req.checkBody("username", "Invalid username!").notEmpty().isAlphanumeric();
    req.checkBody("password", "Password field is empty!").notEmpty();
    req.checkBody("password2", "Passwords don't match!").equals(password);

    var errors = req.validationErrors();

    if(errors){
        req.flash("error", errors[0].msg);
        res.redirect("/signup");
        
    }
    else{
        
        User.findOne({username : username, caseSensitive: false}, function(err, user){
            if(err) throw err;
            if(user){
                req.flash("error", "This username does already exists!");
                res.redirect("/signup");
            }

            else{
                User.findOne({email:email}, function(err, user){
                    if(err) throw err;
                    if(user){
                        req.flash("error", "This email is already in use!");
                        res.redirect("/signup");
                    }
        
                    else{
                        var newUser = new User({
                            email:email,
                            username:username,
                            password: password
                        });
        
                        newUser.save(function(err){
                            req.flash("success", "You have successfully signed up!");
                            res.redirect("/login");
                        });
                    }
                });
            }
        });
    }
    
});

router.post("/login", passport.authenticate("local-login", {
    successRedirect : "/",
    failureRedirect: "/login",
    successFlash :true,
    failureFlash : true
})  );

router.post("/update", function(req,res){
    password =  req.body.password;
    password2 =  req.body.password2;

    req.checkBody("password", "Password field is empty!").notEmpty();
    req.checkBody("password2", "Passwords don't match!").equals(password);

    var errors = req.validationErrors();

    if(errors){
        req.flash("error", errors[0].msg);
        res.redirect("/myaccount");
    }

    else{
        User.findOne({username:req.user.username}, function(err,user){
            if(err) return;
            if(user){
                user.password = password;
                user.save(function(err){
                    if(err) return;
                    else{
                        req.flash("success", "Account updated succesfully");
                        res.redirect("/myaccount");
                    }
                });
            }
        });
    } 
});

module.exports = router;

function isLogged(req,res,next){
    if(req.user) next();
    else {
        req.flash("error", "You are not logged in!");
        res.redirect("/login");
    }
}