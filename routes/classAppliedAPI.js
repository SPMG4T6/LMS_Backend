const express = require('express');
const router = express.Router();
const ClassApplied = require('../models/classApplied');
const Course = require('../models/course');
const Class = require('../models/class');
const User = require('../models/user');
const retrieveApplied = require('./retrieveApplied');
const classApplied = require('../models/classApplied');

/**
 * @swagger
 * /allClassApplied:
 *  get:
 *    summary: Get a list of classes applied
 *    tags: [classApplied]
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Server error
 */
// get a list all classes applied by all learners from the database regardless of status
router.get('/allClassApplied',function(req,res) {
  ClassApplied.find({})
    .then(response => {
      if (response.length > 0) {
        res.status(200).send(response);
      }
      else {
        res.status(404).send({
          message: "Unable to retrieve data"
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Server error"
      })
    });
});

/**
 * @swagger
 * /userClassApplied/{userID}:
 *  get:
 *    summary: Get a list of class applications by a particular learner
 *    tags: [classApplied]
 *    parameters:
 *        - in: path
 *          name: userID
 *          schema:
 *            type: string
 *          required: true
 *          description: Learner's User ID
 *          example: 1
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Server error
 */
// get a list all classes applied by a specific learner from the database regardless of status
router.get('/userClassApplied/:userID',async function(req,res) {
  let searchResult = await User.findOne({userID: req.params.userID});
  if (!searchResult) {
    res.status(404).send({
      message: `User ID ${req.params.userID} does not exist`
    })
  } else {
    ClassApplied.find({userID: req.params.userID})
      .then(response => {
        if (response.length > 0) {
          res.status(200).send(response);
        } else {
          res.status(404).send({
            message: `${req.params.userID} does not have any class applications`
          })
        }
      })
      .catch(error => {
        res.status(500).send({
          messsage: "Server error"
        })
      });
  }
});

/**
 * @swagger
 * /classApplied/{courseCode}/{className}:
 *  get:
 *    summary: Get a list of class applications for a particular class in a particular course
 *    tags: [classApplied]
 *    parameters:
 *        - in: path
 *          name: courseCode
 *          schema:
 *            type: string
 *          required: true
 *          description: Course Code
 *          example: IS212
 *        - in: path
 *          name: className
 *          schema:
 *            type: string
 *          required: true
 *          description: Class Name
 *          example: G1
 *    responses:
 *      '200':
 *        description: A successful response containing all the users who have applied for this class
 */
// get a list all users who applied for a particular class in a particular course from the database regardless of status
router.get('/classApplied/:courseCode/:className', async function(req,res) {
  let promiseArray = [];
  let courseSearch = await Course.findOne({courseCode: req.params.courseCode});
  let classSearch = await Class.findOne({courseCode: req.params.courseCode, className: req.params.className});
  if (!courseSearch) {
    res.status(404).send({
      message: `Course ${req.params.courseCode} not found`
    });
  }
  else if (!classSearch) {
    res.status(404).send({
      message: `${req.params.courseCode} ${req.params.className} not found`
    });
  } else {
    let classApplications = await ClassApplied.find({courseCode: req.params.courseCode, className: req.params.className});
    // console.log(classApplications);
    if (classApplications.length == 0) {
      res.status(400).send({
        message: `No applications for ${req.params.courseCode} ${req.params.className}`
      })
    } else {
      res.status(200).send(classApplications);
    }
  }
});

/**
 * @swagger
 * /classApplied:
 *  post:
 *    summary: Create a classApplied data
 *    tags: [classApplied]
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              courseCode:
 *                type: string
 *              className:
 *                type: string
 *              userID:
 *                type: string
 *              userName:
 *                type: string
 *              status:
 *                type: string
 *                enum:
 *                - Pending
 *                - Approved
 *                - Rejected
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Server error
 */
// add a new class application by student to database
router.post('/classApplied',function(req,res){
  ClassApplied.create(req.body)
    .then(function(classApplied){
        res.status(200).send(classApplied);
    })
    .catch(error => {
      res.status(500).send({
        message: "Server error"
      })
    });
});

/**
 * @swagger
 * /classApplied/delete/{courseCode}/{className}/{userID}:
 *  delete:
 *    summary: Delete a classApplied data
 *    tags: [classApplied]
  *    parameters:
 *        - in: path
 *          name: courseCode
 *          schema:
 *            type: string
 *          required: true
 *          description: Course Code
 *          example: IS212
 *        - in: path
 *          name: className
 *          schema:
 *            type: string
 *          required: true
 *          description: Class Name
 *          example: G1
 *        - in: path
 *          name: userID
 *          schema:
 *            type: string
 *          required: true
 *          description: User ID
 *          example: 1
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Server error
 */
//delete a class application from the database
router.delete('/classApplied/:courseCode/:className/:userID', function(req,res) {
  classApplied.findOneAndDelete({courseCode: req.params.courseCode, className: req.params.className, userID: req.params.userID})
  .exec()
  .then(function(c) {
    if (c!=null) {
      res.status(200).send({
        message: `Application by ${req.params.userID} for ${req.params.courseCode} ${req.params.className} deleted`
      })
    } else {
      res.status(404).send({
        message: `Application by ${req.params.userID} for ${req.params.courseCode} ${req.params.className} does not exist`
      })
    }
  })
  .catch(error =>{
    res.status(500).send({
      message: "Server error"
    })
  })
})

module.exports = router;
