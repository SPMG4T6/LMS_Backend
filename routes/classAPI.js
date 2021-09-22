const express = require('express');
const router = express.Router();
const ClassModel = require('../models/class');
const User = require('../models/user');

/**
 * @swagger
 * /classes:
 *  get:
 *    summary: Get a list of classes
 *    tags: [class]
 *    responses:
 *      '200':
 *        description: A successful response
 */
// get a list of classes from the database
router.get('/classes',function(req,res,next) {
  ClassModel.find({})
    .then(function(classes){
        res.send(classes);
    })
    .catch(next);
});

/**
 * @swagger
 * /class:
 *  post:
 *    summary: Create a class
 *    description: Quiz duration is in minutes
 *    tags: [class]
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
 *                type: array
 *                items:
 *                  type: string
 *              quizDetails:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    question:
 *                      type: string
 *                      example: What is the right way to eat?
 *                    option:
 *                      type: array
 *                      items:
 *                        type: string
 *                    answer:
 *                      type: string
 *                    duration:
 *                      type: integer
 *                      example: 10
 *              classStartDate:
 *                type: string
 *                pattern: '^\d{2}/\d{2}/\d{4}$'
 *                example: 22/06/2021
 *              classEndDate:
 *                type: string
 *                pattern: '^\d{2}/\d{2}/\d{4}$'
 *                example: 15/10/2021
 *              enrolmentStartDate:
 *                type: string
 *                pattern: '^\d{2}/\d{2}/\d{4}$'
 *                example: 15/06/2021
 *              enrolmentEndDate:
 *                type: string
 *                pattern: '^\d{2}/\d{2}/\d{4}$'
 *                example: 21/09/2021
 *              minClassSize:
 *                type: integer
 *                minimum: 1
 *              maxClassSize:
 *                type: integer
 *                minimum: 1
 *              enrolledStudents:
 *                type: array
 *                items:
 *                  type: string
 *            required:
 *              - courseCode
 *              - className
 *              - userID
 *              - classStartDate
 *              - classEndDate
 *              - enrolmentStartDate
 *              - enrolmentEndDate
 *              - minClassSize
 *              - maxClassSize
 *    responses:
 *      '200':
 *        description: A successful response
 */
// add a new class to database
router.post('/class',function(req,res,next){
  ClassModel.create(req.body)
    .then(function(c){
        res.send(c);
    })
    .catch(next);
});

/**
 * @swagger
 * /class/quiz:
 *  put:
 *    summary: Update the graded class quiz
 *    description: Replaces the quizDetails in the database with your request body's quizDetails (Quiz duration is in minutes)
 *    tags: [class]
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
 *              quizDetails:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    question:
 *                      type: string
 *                      example: What is the right way to eat?
 *                    option:
 *                      type: array
 *                      items:
 *                        type: string
 *                    answer:
 *                      type: string
 *                    duration:
 *                      type: integer
 *                      example: 10
 *            required:
 *              - courseCode
 *              - className
 *              - quizDetails
 *    responses:
 *      '200':
 *        description: A successful response
 */
// Update a grade quiz for the class
router.put('/class/quiz', function(req,res,next){

  let quizDetails = req.body.quizDetails;
  console.log(req.body)
  // replaces the entire quiz details
  ClassModel.findOneAndUpdate({ courseCode: req.body.courseCode, className: req.body.className }, { quizDetails: quizDetails }, { new: true }, (err, doc) => {
    if (err) { res.status(404).json({ error: "Class not found" }) };
    res.send(doc); // returns the update
  });
})

/**
 * @swagger
 * /class/enrol/{userID}:
 *  put:
 *    summary: Assigning an engineer to a class
 *    description: Pushes the engineer into the enrolledStudents field
 *    tags: [class]
 *    parameters:
 *        - in: path
 *          name: userID
 *          schema:
 *            type: string
 *          required: true
 *          description: Learner's User ID
 *          example: IS442
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
 *              userType:
 *                type: string
 *                enum:
 *                - learner
 *                - trainer
 *                example: learner
 *            required:
 *              - courseCode
 *              - className
 *              - userType
 *    responses:
 *      '200':
 *        description: A successful response
 */
// Assigning an engineer
router.put('/class/enrol/:userID', async function(req,res,next){
  
  let user = await User.findOne({ userID: req.params.userID }).exec();

  if (user) {

    let learningCourses = user.learningCourses;
    let teachingCourses = user.teachingCourses;
    let completedCourses = user.completedCourses;

    // check if user is doing/did the course
    const courseCode = req.body.courseCode;
    if (learningCourses.includes(courseCode)) {
      res.status(404).json({ error: `${user.userID} is currently learning in ${courseCode}` })
    } else if (teachingCourses.includes(courseCode)) {
      res.status(404).json({ error: `${user.userID} is currently teaching in ${courseCode}` })
    } else if (completedCourses.includes(courseCode)) {
      res.status(404).json({ error: `${user.userID} has completed ${courseCode}` })
    } else {
      
      // user has no affiliation to this course
      let classDoc = await ClassModel.findOne({ courseCode: req.body.courseCode, className: req.body.className });
      if (classDoc) {
          let enrolledStudents = classDoc.enrolledStudents;
          if (enrolledStudents.includes(user.userID)) {
            res.status(404).json({ error: `${user.userID} is currently in the course` })
          } else {
            // Add the userID into the current enrolled list
            enrolledStudents.push(user.userID);
            ClassModel.findOneAndUpdate({ courseCode: req.body.courseCode, className: req.body.className }, { enrolledStudents: enrolledStudents }, { new: true }, (err, doc) => {
              if (err) { res.status(404).json({ error: "Class not found" }) };
              res.send(doc); // returns the update
            });
          }
      } else { res.status(404).json({ error: "Class not found" }) }
      
    }

    

  } else {
    res.status(404).json({ error: "User not found" })
  }
})


module.exports = router;
