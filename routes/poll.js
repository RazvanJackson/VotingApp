const express = require("express");
const Poll = require("../models/poll");

const router = express.Router();

router.get("/new-poll", isLogged, function(req,res){
    res.render("new-poll");
});

router.get("/my-polls", isLogged, function(req,res){
    Poll.find({author:req.user.id}, function(err,data){
        if(err) return err;
        else{
            res.render("my-polls",{
                myPolls : data
            });
        }
    });
});

router.get("/all", function(req,res){
    let limitSize = 5;
    let skipSize = req.query.page * limitSize - limitSize;
    let totalPolls;
    let totalPages;

    Poll.find({}, function(err,polls){
        if(err) return err;
        else{
            Poll.count({},function(err,number){
                if(err) return err;
                else{
                    totalPolls=number;
                    if(totalPolls%limitSize==0) totalPages=totalPolls/limitSize;
                    else totalPages=Math.floor(totalPolls/limitSize)+1;
                    res.render("all-polls",{
                        polls : polls,
                        totalPages : totalPages,
                        currentPage : parseInt(req.query.page)
                    });
                }
            });
        }
    }).limit(limitSize).skip(skipSize);
});

router.get("/:id", function(req,res){
    Poll.findOne({_id:req.params.id}, function(err,poll){
        if(err) return err;
        else{
            let alreadyVoted = false;
            let totalVotes = 0;

            if(req.user !== undefined) if(poll.voters.includes(req.user.id)) alreadyVoted = true;
            
            poll.options.forEach(function(element){
                 totalVotes += element.votes;
            })
            
            res.render("poll",{
                poll : poll,
                alreadyVoted : alreadyVoted,
                totalVotes : totalVotes,
                isConnected : req.user
            });
        }
    });
});

router.post("/submit-new-poll", isLogged, function(req,res){
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

router.post("/submit-vote", isLogged, function(req,res){
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

function isLogged(req,res,next){
    if(req.user) next();
    else {
        req.flash("error", "You are not logged in!");
        res.redirect("/login");
    }
}