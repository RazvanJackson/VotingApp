const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser =require("cookie-parser");
const flash = require("connect-flash");
const passport = require("passport");
const expressValidator = require("express-validator");
const expressSession = require("express-session");

const indexRouter = require("./routes/index");
const pollRouter = require("./routes/poll");

const app = express();

//Database Server
mongoose.connect("mongodb://admin:admin@ds137435.mlab.com:37435/vote");

require("./config/passport");

//View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//Middlewares
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(express.static(path.join(__dirname, "public")));
app.use(expressSession({secret:"secret", saveUninitialized:false, resave:false}));
app.use(cookieParser("secret"));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//Routes

// App Locals 
app.use(function(req,res,next){
    // Flash Messages
    app.locals.error = req.flash("error");
    app.locals.success = req.flash("success");
    // User
    app.locals.user = req.user;
    next();
});

app.use("/", indexRouter);
app.use("/poll", pollRouter);

// Server Setup
const port = 3000;
app.listen(port);

// app.locals
app.locals = {
    showRegisterBtn : true
}

module.exports.locals = app.locals;

