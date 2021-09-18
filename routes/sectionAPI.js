const express = require('express');
const router = express.Router();
const Section = require('../models/section');

// get a list of all sections from the database
router.get('/sections',function(req,res,next) {
  Section.find({})
    .then(function(sections){
        res.send(sections);
    })
    .catch(next);
});

// add a new section of class to database
router.post('/section',function(req,res,next){
  Section.create(req.body)
    .then(function(section){
        res.send(section);
    })
    .catch(next);
});

module.exports = router;
