const express = require('express');
const router = express.Router();
const Grade = require('../models/grade');

// get a list of students from the database
router.get('/grades',function(req,res,next) {
  Grade.find({})
    .then(function(grades){
        res.send(grades);
    })
    .catch(next);
});

// add a new student to database
router.post('/grade',function(req,res,next){
  Grade.create(req.body)
    .then(function(grade){
        res.send(grade);
    })
    .catch(next);
});

module.exports = router;
