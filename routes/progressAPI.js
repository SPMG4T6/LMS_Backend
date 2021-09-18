const express = require('express');
const router = express.Router();
const Grade = require('../models/progress');

// get a list of all progresses made by students from the database
router.get('/allProgress',function(req,res,next) {
  Progress.find({})
    .then(function(progress){
        res.send(progress);
    })
    .catch(next);
});

// add a new progress to database
router.post('/progress',function(req,res,next){
  Progress.create(req.body)
    .then(function(progress){
        res.send(progress);
    })
    .catch(next);
});

module.exports = router;
