const express = require('express');
const router = express.Router();
const Course = require('../models/course');

// get a list of all courses from the database
router.get('/courses',function(req,res,next) {
  Course.find({})
    .then(function(courses){
        res.send(courses);
    })
    .catch(next);
});

// add a new course to database
router.post('/course',function(req,res,next){
  Course.create(req.body)
    .then(function(course){
        res.send(course);
    })
    .catch(next);
});

// update a course detail (only course title and description and prereqs allowed for now) in the database
router.put('/course/:courseCode',function(req,res){
  let fieldsToUpdate = {
    courseTitle: req.body.courseTitle,
    courseDeciption: req.body.courseDescription,
    prereqCourses: req.body.prereqCourses
  }
  
  for (const [key, value] of Object.entries(fieldsToUpdate)) {
    if (!value) {
      delete fieldsToUpdate[key]
    }
  }

  Course.findOneAndUpdate({courseID: req.params.courseID}, { $set: { ...fieldsToUpdate } } )
  .then(function(course){
    Course.findOne({courseID: req.params.courseID}).then(function(course){
          res.send(course);
      });
  });
});

module.exports = router;
