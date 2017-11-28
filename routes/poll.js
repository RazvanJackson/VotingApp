const express = require("express");
const Poll = require("../models/poll");

const router = express.Router();

router.get("/new-poll", function(req,res){
    res.render("new-poll");
});

router.get("/my-polls", function(req,res){
    Poll.find({author:req.user.id}, function(err,data){
        if(err) return err;
        else{
            res.render("my-polls",{
                myPolls : data
            });
        }
    });
});

router.get("/:id", function(req,res){
    Poll.findOne({_id:req.params.id}, function(err,poll){
        if(err) return err;
        else{
            let alreadyVoted = false;
            let totalVotes = 0;

            if(poll.voters.includes(req.user.id)) alreadyVoted = true;
            
            poll.options.forEach(function(element){
                 totalVotes += element.votes;
            })
            
            res.render("poll",{
                poll : poll,
                alreadyVoted : alreadyVoted,
                totalVotes : totalVotes
            });
        }
    });
});

router.post("/submit-new-poll", function(req,res){
    let optionNumber = 1;
    let currentOption;

    let question = req.body.question;
    let arr = [];

    function Object(answer){
        this.answer = answer;
        this.votes = 0;
    }

    let errBol = false;

    if(question){
        do{
                if(req.body["option" + optionNumber] == ""){
                errBol = true;
                req.flash("error", "All fields must be completed");
                res.redirect("/poll/new-poll");
            }

            arr.forEach(function(element){
                if(element.answer == req.body["option" + optionNumber]){
                    errBol = true;
                    req.flash("error", "All fields must be different");
                    res.redirect("/poll/new-poll");
                }
            });
            
            if(!errBol){
                let newObject;
                
                currentOption = req.body["option" + optionNumber];
                newObject = new Object(req.body["option" + optionNumber]);
                arr.push(newObject);
                optionNumber++;
            }

        }while(!errBol && req.body["option" + optionNumber]!==undefined)

        if(!errBol){
        let newPoll = new Poll({
            question : question,
            author : req.user.id,
            options : arr,
            voters : []
         });
         newPoll.save(function(err){
            if(err) throw err;
            else{
                req.flash("success", "Poll successful added!");
                res.redirect("/poll/new-poll");
            }
        });
        }
        
    }
    else{
        req.flash("error", "You don't have a question!");
        res.redirect("/poll/new-poll");
    } 
});

router.post("/submit-vote", function(req,res){
    let pollId = req.body.pollId;
    let optionVoted = req.body.option;
    
    Poll.findOne({_id:pollId}, function(err,poll){
        if(err) return err;
        
        else if(poll.voters.includes(req.user.id)){
            req.flash("error", "You've already voted");
            res.redirect("/poll/"+pollId);            
        }

        else{
            poll.options.forEach(function(element){
                if(element.answer == optionVoted){
                    element.votes++;
                    poll.voters.push(req.user.id);
                    poll.save(function(err){
                        if(err) return err;
                        else {
                            req.flash("success", "Succesfully voted!");
                            res.redirect("/poll/"+pollId);
                        }
                    });
                }
            });
        }
    });

});

module.exports = router;