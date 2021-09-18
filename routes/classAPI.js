const express = require('express');
const router = express.Router();
const Class = require('../models/class');

// get a list of students from the database
router.get('/allClass',function(req,res,next) {
  Class.find({})
    .then(function(allClass){
        res.send(allClass);
    })
    .catch(next);
});

// add a new student to database
router.post('/class',function(req,res,next){
  Class.create(req.body)
    .then(function(aClass){
        res.send(aClass);
    })
    .catch(next);
});

module.exports = router;
