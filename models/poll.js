const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

mongoose.connect("mongodb://admin:admin@ds137435.mlab.com:37435/vote");

var pollSchema = mongoose.Schema({
    question : {
        type: String,
        required: true
    },

    author : {
        type: String,
        required : true
    },

    options : [
        {
            answer : String,
            votes: Number
        }
    ],

    voters : {
        type: Array
    },

    date : {
        type: Date,
        default : Date.now()
    }
});

var Poll = mongoose.model("poll", pollSchema, "polls");
module.exports = Poll;