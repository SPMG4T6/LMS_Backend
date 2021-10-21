const express = require('express');
const router = express.Router();
const ClassModel = require('../models/class');
const User = require('../models/user');
const CourseModel = require('../models/course');
const courseEligibility = require("./courseEligibility");

/**
 * @swagger
 * /classes:
 *  get:
 *    summary: Get a list of classes
 *    tags: [class]
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Failure to get list of classes
 */
// get a list of classes from the database
router.get('/classes',function(req,res,next) {
  ClassModel.find({})
    .then(response => {
      if (response.length > 0) {
        res.status(200).send(response);
      }
      else {
        res.status(500).send({
          message: "Unable to get list of classes"
        })
      }
    })
    .catch(response => {
      res.status(500).send({
        message: response
      });
    });
});

/**
 * @swagger
 * /classes/view/{courseCode}:
 *  get:
 *    summary: Get classes by courseCode
 *    tags: [class]
 *    parameters:
 *        - in: path
 *          name: courseCode
 *          schema:
 *            type: string
 *          required: true
 *          description: The course's code
 *          example: IS216
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Failure to find classes with courseCode
 */
// get class details by courseCode
router.get('/classes/view/:courseCode', function(req,res,next) {
  ClassModel.find({"courseCode": req.params.courseCode})
  .then(response => {
    if (response.length > 0) {
      res.status(200).send(response);
    }
    else {
      res.status(500).send({
        courseCode: req.params.courseCode,
        message: "Unable to get class details"
      })
    }
  })
  .catch(response => {
    res.status(500).send({
      message: response
    });
  });
});


/**
 * @swagger
 * /class/view/{courseCode}/{className}:
 *  get:
 *    summary: Get class by courseCode and className
 *    tags: [class]
 *    parameters:
 *        - in: path
 *          name: courseCode
 *          schema:
 *            type: string
 *          required: true
 *          description: The course's code
 *          example: IS216
 *        - in: path
 *          name: className
 *          schema:
 *            type: string
 *          required: true
 *          description: The class name
 *          example: G1
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *         description: Class not found
 */
// get class details by courseCode and className
router.get('/class/view/:courseCode/:className', function(req,res,next) {
  ClassModel.find({courseCode: req.params.courseCode, className: req.params.className})
  .then(response => {
    if (response.length > 0) {
      res.status(200).send(response)
    } else {
      res.status(500).send({
        courseCode: req.params.courseCode,
        className: req.params.className,
        message: "Error! Class not found!"
      })
    }
  })
  .catch(error => {
    res.status(500).send({
      message: error
    });
  });
});

/**
 * @swagger
 * /class/view/eligibleUsers/{courseCode}/{className}:
 *  get:
 *    summary: Get all users who are eligible to enrol in the class
 *    tags: [class]
 *    parameters:
 *        - in: path
 *          name: courseCode
 *          schema:
 *            type: string
 *          required: true
 *          description: The course's code
 *          example: IS216
 *        - in: path
 *          name: className
 *          schema:
 *            type: string
 *          required: true
 *          description: The class name
 *          example: G1
 *    responses:
 *      '200':
 *        description: A successful response
 */
// get all eligible users by courseCode and className
router.get('/class/view/eligibleUsers/:courseCode/:className', async function(req,res,next) {
  let courseDoc = await CourseModel.findOne({courseCode: req.params.courseCode})
  let classDoc = await ClassModel.findOne({ courseCode: req.params.courseCode, className: req.params.className });
  User.find({})
  .then(response => {
    let eligibleUsers = courseEligibility({courseDoc: courseDoc, userArray: response, classDoc: classDoc})
    .then(response => {
      if (response.length > 0) {
        console.log(response);
        res.send(response);
      }
      else {
        res.status(500).send({
          "status": "500",
          "courseCode": req.params.courseCode,
          "className": req.params.className,
          "message": `No eligible learners available for this course`
        })
      }
    })
    .catch((message) => {
      res.status(500).send({
        message:message
      });
    });
  })
  .catch((message) => {
    res.status(500).send({
      message: message
    })
  })
  
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
 *                example: 22/06/2021
 *              classEndDate:
 *                type: string
 *                example: 15/10/2021
 *              enrolmentStartDate:
 *                type: string
 *                example: 15/06/2021
 *              enrolmentEndDate:
 *                type: string
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
 *      '500':
 *         description: Class already exists
 */
// add a new class to database
router.post('/class', async function(req,res,next){
  let searchResult = await ClassModel.findOne({courseCode: req.body.courseCode, className: req.body.className});
  if (!searchResult) {
    ClassModel.create(req.body)
      .then(response => {
        // console.log(response);
        res.status(200).send({
          status: "200",
          message: `${req.body.courseCode} ${req.body.className} class created`
        });
      })
      .catch(response => {
        res.status(500).send({
          "message": "Unknown error occurred",
          "data": response.json
        })
      });
  }
  else {
    res.status(500).send({
      "code": "500",
      "message": `Class ${req.body.courseCode} ${req.body.className} already exists!`
    })
  }
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
  // console.log(req.body)
  // replaces the entire quiz details
  ClassModel.findOneAndUpdate({ courseCode: req.body.courseCode, className: req.body.className }, { quizDetails: quizDetails }, { new: true }, (err, doc) => {
    if (err) { res.status(404).json({ error: "Class not found" }) };
    res.status(200).send(doc); // returns the update
  });
})

/**
 * @swagger
 * /class/enrol/{userID}:
 *  put:
 *    summary: Assigning an engineer to a class
 *    description: Pushes the engineer into the enrolledStudents field, addes the courseCode into the user's learningCourses array
 *    tags: [class]
 *    parameters:
 *        - in: path
 *          name: userID
 *          schema:
 *            type: string
 *          required: true
 *          description: The User ID
 *          example: 0123456
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Error updating User
 */
// Assigning an engineer
router.put('/class/enrol/:userID', async function(req,res,next){
  let classDoc = await ClassModel.findOne({ courseCode: req.body.courseCode, className: req.body.className });
  let user = await User.findOne({UserID: req.params.userID}).exec();
  let learningCourses = user.learningCourses;
  let enrolledStudents = classDoc.enrolledStudents;

  enrolledStudents.push(req.params.userID);
  ClassModel.findOneAndUpdate({ courseCode: req.body.courseCode, className: req.body.className }, { enrolledStudents: enrolledStudents }, { new: true }, (err, doc) => {
    if (err) { 
      res.status(404).json({ error: "Class not found" }) 
    };
    console.log("Class enrolledStudents updated")
    learningCourses.push(req.body.courseCode);

    // add the courseCode to the learningCourses array of the user
    User.findOneAndUpdate({userID: req.params.userID}, {learningCourses: learningCourses}, {new: true}, (err, doc) => {
      if (err) {
        res.status(500).json({error: "Error updating User;"})
      }
      res.status(200).json({message: `User ${req.params.userID} successfully enrolled into ${req.body.courseCode} ${req.body.className}`});
    })
  });
})

module.exports = router;
