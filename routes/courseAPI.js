const express = require('express');
const router = express.Router();
const Course = require('../models/course');

// get a list of students from the database
router.get('/courses',function(req,res,next) {
  Course.find({})
    .then(function(courses){
        res.send(courses);
    })
    .catch(next);
});

// add a new student to database
router.post('/course',function(req,res,next){
  Course.create(req.body)
    .then(function(course){
        res.send(course);
    })
    .catch(next);
});

module.exports = router;
