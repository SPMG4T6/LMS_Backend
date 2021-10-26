const express = require('express');
const router = express.Router();
const ClassModel = require('../models/class');
const User = require('../models/user');
const CourseModel = require('../models/course');
const courseEligibility = require("./courseEligibility");
const retrieveEnrolled = require('./retrieveEnrolled');

/**
 * @swagger
 * /classes:
 *  get:
 *    summary: Get a list of classes
 *    tags: [class]
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: No classes exist
 *      '500':
 *        description: Server error
 */
// get a list of classes from the database
router.get('/classes',function(req,res,next) {
  ClassModel.find({})
    .then(response => {
      if (response.length > 0) {
        res.status(200).send(response);
      }
      else {
        res.status(400).send({ message: "No classes exist" })
      }
    })
    .catch(error => {
      res.status(500).send({ message: "Server error" });
    });
});

/**
 * @swagger
 * /class/view/{courseCode}:
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
 *      '404':
 *        description: Class with (courseCode) do not exist
 *      '500':
 *        description: Server error
 */
// get class details by courseCode
router.get('/class/view/:courseCode', function(req,res,next) {
  ClassModel.find({"courseCode": req.params.courseCode})
  .then(response => {
    if (response.length > 0) {
      res.status(200).send(response);
    }
    else {
      res.status(404).send({ message: "Class with " + req.params.courseCode + " do not exist" })
    }
  })
  .catch(error => {
    res.status(500).send({ message: "Server error" });
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
 *      '404':
 *        description: Error! Class not found!
 *      '500':
 *         description: Server error
 */
// get class details by courseCode and className
router.get('/class/view/:courseCode/:className', function(req,res,next) {
  ClassModel.find({courseCode: req.params.courseCode, className: req.params.className})
  .then(response => {
    if (response.length > 0) {
      res.status(200).send(response)
    } else {
      res.status(404).send({ message: "Error! Class not found!" })
    }
  })
  .catch(error => {
    res.status(500).send({ message: "Server error" });
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
 *      '404':
 *        description: No eligible learners available for this course
 *      '500':
 *        description: Server error
 */
// get all eligible users by courseCode and className
router.get('/class/view/eligibleUsers/:courseCode/:className', async function(req,res,next) {
  let courseDoc = await CourseModel.findOne({ courseCode: req.params.courseCode })
  let classDoc = await ClassModel.findOne({ courseCode: req.params.courseCode, className: req.params.className });

  if (courseDoc && classDoc) {
    User.find({})
      .then(response => {
        let eligibleUsers = courseEligibility({courseDoc: courseDoc, userArray: response, classDoc: classDoc})
        .then(response => {
          if (response.length > 0) {
            // console.log(response);
            res.send(response);
          }
          else {
            res.status(404).send({ message: `No eligible learners available for this course` })
          }
        })
        .catch((err) => {
          res.status(500).send({ message: "Server error" });
        });
      })
      .catch((err) => {
        res.status(500).send({ message: "Server error" })
      })
  } else {
    res.status(500).send({ message: "Server error" });
  }

  

});

/**
 * @swagger
 * /class/view/enrolledUsers/{courseCode}/{className}:
 *  get:
 *    summary: Get all users who are enrolled in the class
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
 *      '404':
 *        description: Unable to find class
 *      '500':
 *        description: Server error
 */
// get all enrolled users by courseCode and className
router.get('/class/view/enrolledUsers/:courseCode/:className', async function(req,res) {
  let promiseArray = [];
  let classDoc = await ClassModel.findOne({ courseCode: req.params.courseCode, className: req.params.className });
  if (classDoc) {
    // enrolledStudents is an array of userIDs
    let enrolledStudents = classDoc.enrolledStudents;
    // console.log(enrolledStudents);
    enrolledStudents.forEach(element => {
      promiseArray.push(retrieveEnrolled(element));
    });
    Promise.all(promiseArray)
    .then(response => {
      //response is an array of user objects
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send({ message: "Server error" });
    })
  }
  else {
    res.status(404).send({ message: "Unable to find class" })
  }
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
 *      '400':
 *        description: Class already exists
 *      '500':
 *        description: Server error
 */
// add a new class to database
router.post('/class', async function(req,res,next){
  let searchResult = await ClassModel.findOne({courseCode: req.body.courseCode, className: req.body.className});
  if (!searchResult) {
    ClassModel.create(req.body)
      .then(response => {
        // console.log(response);
        res.status(200).send(response);
      })
      .catch(res => {
        res.status(500).send({ message: "Server error" })
      });
  }
  else {
    res.status(400).send({ message: `Class ${req.body.courseCode} ${req.body.className} already exists!` })
  }
});

/**
 * @swagger
 * /class/quiz/{userID}:
 *  post:
 *    summary: Auto grade your quiz and update your user table if passed
 *    description: Automatically grade your quiz, returns boolean. (if passes, automatically adds to User CompletedCourses Field)
 *    tags: [class]
 *    parameters:
 *        - in: path
 *          name: userID
 *          schema:
 *            type: string
 *          required: true
 *          description: The User ID
 *          example: 0123456
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
 *              quizAnswers:
 *                type: array
 *                items:
 *                  answer:
 *                    type: string
 *                    example: print()
 *                    
 *            required:
 *              - courseCode
 *              - className
 *              - quizAnswers
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Class or User do not exist
 *      '500':
 *        description: Server error.
 */
router.post('/class/quiz/:userID', async function(req,res,next) {
  
  // Get answer in body
  let submittedAnswerList = req.body.quizAnswers;

  // compare to quizDetails in Class
  let classDoc = await ClassModel.findOne({ courseCode: req.body.courseCode, className: req.body.className }).exec();
  let user = await User.findOne({ userID: req.params.userID }).exec();
  let courseDoc = await CourseModel.findOne({ courseCode: req.body.courseCode }).exec();

  if (classDoc && courseDoc) {
    if (user) {

      let answerList = classDoc.quizDetails;
      let passingMark = courseDoc.quizPassingMark;
      let marksObtained = 0;

      for (let i = 0; i < answerList.length; i++) {
        if (answerList[i].answer === submittedAnswerList[i]) {
          marksObtained += 1;
        }
      }

      let marksOutput = marksObtained + "/" + answerList.length;

      if (marksObtained >= passingMark) {
        
        let userLearningCourses = user.learningCourses;
        let userCompletedCourses = user.completedCourses;
        let index = userLearningCourses.indexOf(req.body.courseCode);


        if (index > -1) {
          userLearningCourses.splice(index, 1);
          userCompletedCourses.push( [req.body.courseCode, marksOutput] );
          user.learningCourses = userLearningCourses;
          user.completedCourses = userCompletedCourses

          await user.save();
          res.status(200).send({ status: true, marks: marksOutput })

        } else { 
          res.status(404).send({ message: "User is not currently enrolled in the course"}); 
        }
      } else {
        res.status(200).send({ status: false, marks: marksObtained + "/" + answerList.length })
      }
    } else { res.status(404).send({ message: "User " + req.params.userID + " do not exist." }) }
  } else { res.status(404).send({ message: "Either " + req.body.courseCode + " or " + req.body.className + " do not exist." }) }
})

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
 *      '404':
 *        description: Class XXX (className) do not exist
 *      '500':
 *        description: Server error.
 */
// Update a grade quiz for the class
router.put('/class/quiz', function(req,res,next){
  let quizDetails = req.body.quizDetails;
  // console.log(req.body)
  // replaces the entire quiz details
  ClassModel.findOneAndUpdate({ courseCode: req.body.courseCode, className: req.body.className }, { quizDetails: quizDetails }, { new: true }, (err, doc) => {
    if (err) { res.status(500).send({ message: "Server error" }) };
    if (doc) { res.status(200).send(doc); } // returns the update
    else { res.status(404).send({ message: "Class " + req.body.className + " do not exist" }) }
  })
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
 *            required:
 *              - courseCode
 *              - className
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Class or User not found
 *      '500':
 *        description: Server error
 */
// Assigning an engineer
router.put('/class/enrol/:userID', async function(req,res,next){
  let classDoc = await ClassModel.findOne({ courseCode: req.body.courseCode, className: req.body.className });
  let user = await User.findOne({UserID: req.params.userID}).exec();
  let learningCourses = user.learningCourses;

  if (classDoc) {
    if (user) {
      let enrolledStudents = classDoc.enrolledStudents;

      enrolledStudents.push(req.params.userID);
    
      ClassModel.findOneAndUpdate({ courseCode: req.body.courseCode, className: req.body.className }, { enrolledStudents: enrolledStudents }, { new: true }, (err, doc) => {
        if (err) { 
          // res.status(404).send("Class " + req.body.className + " not found") 
          res.status(500).send({ message: "Server error" })
        }
        else if (doc) {
          // console.log("Class enrolledStudents updated")
          learningCourses.push(req.body.courseCode);
    
          // add the courseCode to the learningCourses array of the user
          User.findOneAndUpdate({userID: req.params.userID}, {learningCourses: learningCourses}, {new: true}, (userErr, userDoc) => {
            if (userErr) {
              // res.status(404).send("User " + req.params.userID + " do not exist")
              res.status(500).send({ message: "Server error" })
            }
            else if (userDoc) { 
              res.status(200).send(userDoc);
            } else { res.status(404).send({ message: "User " + req.params.userID + " do not exist" }) }
          })
        } else { res.status(404).send({ message: "Class " + req.body.className + " not found" }) }
      });
    } else { res.status(404).send({ message: "User " + req.params.userID + " do not exist." }) }
  } else { res.status(404).send({ message: "Class (" + req.body.courseCode + "), " + req.body.className + " do not exist." }) }
  
})

/**
 * @swagger
 * /class/{courseCode}/{className}:
 *  delete:
 *    summary: Delete a specific class
 *    tags: [class]
 *    parameters:
 *        - in: path
 *          name: courseCode
 *          schema:
 *            type: string
 *          required: true
 *          description: The class courseCode
 *        - in: path
 *          name: className
 *          schema:
 *            type: string
 *          required: true
 *          description: Name of the class
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Class XXX(className) do not exist
 *      '500':
 *        description: Server error
 */
// delete a user from the database
router.delete('/class/:courseCode/:className',function(req,res,next) {
  ClassModel.findOneAndDelete({ courseCode: req.params.courseCode, className: req.params.className })
  .exec()
  .then(function(c){
    if (c !== null) {
      res.status(200).send("Class " + req.params.className + " deleted");
    } else {
      res.status(404).send({ message: "Class " + req.params.className + " do not exist" })
    }
  })
  .catch((res) => res.status(500).send({ message: "Server error" }));
});

module.exports = router;
