const express = require('express');
const router = express.Router();
const Student = require('../models/user');

// get a list of all users from the database
router.get('/users',function(req,res,next) {
    Student.find({})
    .then(function(students){
        res.send(students);
    })
    .catch(next);
});

// add a new user to database
router.post('/user',function(req,res,next){
    Student.create(req.body)
    .then(function(student){
        res.send(student);
    })
    .catch(next);
});

// update a user in the database
router.put('/user/:id',function(req,res,next){
    Student.findOneAndUpdate({_id: req.params.id},req.body)
    .then(function(student){
        Student.findOne({_id: req.params.id}).then(function(student){
            res.send(student);
        });
    });
});

// delete a user from the database
router.delete('/user/:id',function(req,res,next){
    Student.findOneAndDelete({_id: req.params.id})
    .then(function(student){
        res.send(student);
    });
});

module.exports = router;
