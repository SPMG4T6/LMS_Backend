const express = require('express');
const router = express.Router();
const Class = require('../models/class');
const Course = require('../models/course');

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
  Class.find({})
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
router.post('/class', async function(req,res,next){

  var course = await Course.find({ courseID: req.body.courseID }).exec();
  if (course == null) {
    Class.create(req.body)
      .then(function(aClass){
        res.send(aClass);
      })
      .catch(next);
  } else { res.status(404).json({ error: "Course not found" }) }
  
});

/**
 * @swagger
 * /class/quiz/{courseCode}/{className}:
 *  put:
 *    summary: Update the graded class quiz
 *    description: Quiz duration is in minutes
 *    tags: [class]
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
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
 *              - quizDetails
 *    responses:
 *      '200':
 *        description: A successful response
 */
// Update a grade quiz for the class
router.put('/class/quiz/:courseCode/:className/', async function(req,res,next){

  let quizDetails = req.body.quizDetails;

  // replaces the entire quiz details
  Section.findOneAndUpdate({ courseCode: req.params.courseCode, className: req.params.className }, { quizDetails: quizDetails }, { new: true }, (err, doc) => {
    if (err) { res.status(404).json({ error: "Class not found" }) };
    res.send(doc); // returns the update
  });
})

module.exports = router;
