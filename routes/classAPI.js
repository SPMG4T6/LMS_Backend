const express = require('express');
const router = express.Router();
const Class = require('../models/class');
const Course = require('../models/course');

// get a list of classes from the database
router.get('/classes',function(req,res,next) {
  Class.find({})
    .then(function(classes){
        res.send(classes);
    })
    .catch(next);
});

// add a new class to database
router.post('/class', async function(req,res,next){

  var course = await Course.find({ courseID: req.body.courseID }).exec();
  console.log(course)
  if (course == null) {
    Class.create(req.body)
      .then(function(aClass){
        res.send(aClass);
      })
      .catch(next);
  } else { res.status(404).json({ error: "Course not found" }) }
  
});

module.exports = router;
