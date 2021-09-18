const express = require('express');
const router = express.Router();
const ClassApplied = require('../models/classApplied');

// get a list of students from the database
router.get('/classApplieds',function(req,res,next) {
  ClassApplied.find({})
    .then(function(classApplieds){
        res.send(classApplieds);
    })
    .catch(next);
});

// add a new student to database
router.post('/classApplied',function(req,res,next){
  ClassApplied.create(req.body)
    .then(function(classApplied){
        res.send(classApplied);
    })
    .catch(next);
});

module.exports = router;
