const express = require('express');
const router = express.Router();
const ClassModel = require('../models/class');
const User = require('../models/user');
const Section = require('../models/section');
const CourseModel = require('../models/course');
const ProgressModel = require('../models/progress');
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
router.get('/classes', function (req, res, next) {
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
router.get('/class/view/:courseCode', function (req, res, next) {
  ClassModel.find({ "courseCode": req.params.courseCode })
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
router.get('/class/view/:courseCode/:className', function (req, res, next) {
  ClassModel.find({ courseCode: req.params.courseCode, className: req.params.className })
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
router.get('/class/view/eligibleUsers/:courseCode/:className', async function (req, res, next) {
  let courseDoc = await CourseModel.findOne({ courseCode: req.params.courseCode })
  let classDoc = await ClassModel.findOne({ courseCode: req.params.courseCode, className: req.params.className });

  if (courseDoc && classDoc) {
    User.find({})
      .then(response => {
        courseEligibility({ courseDoc: courseDoc, userArray: response, classDoc: classDoc })
          .then(response => {
            if (response.length > 0) {
              // console.log(response);
              res.status(200).send(response);
            }
            else {
              res.status(404).send({ message: `No eligible learners available for this course` })
            }
          })
          .catch((err) => {
            res.status(400).send({ message: `${err}` });
          });
      })
      .catch((err) => {
        res.status(500).send({ message: `${err}` })
      })
  } else {
    res.status(404).send({ message: "courseCode: " + req.params.courseCode + " or className: " + req.params.className + " do not exist" });
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
router.get('/class/view/enrolledUsers/:courseCode/:className', async function (req, res) {
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
 *              quizDuration:
 *                type: integer
 *                example: 10
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
 *              - quizDuration
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Class already exists
 *      '500':
 *        description: Server error
 */
// add a new class to database
router.post('/class', async function (req, res) {
  let searchResult = await ClassModel.findOne({ courseCode: req.body.courseCode, className: req.body.className });
  if (!searchResult) {
    const trainerIDArray = req.body.userID;
    const courseCode = req.body.courseCode;
    trainerIDArray.forEach(element => {
      User.findOne({ userID: element })
        .then(response => {
          const teachingCourses = response.teachingCourses;
          if (!teachingCourses.includes(courseCode)) {
            teachingCourses.push(courseCode);
          }
          User.findOneAndUpdate({ userID: element }, { teachingCourses: teachingCourses }, { new: true }, (err, doc) => {
            if (err) { res.status(500).send({ message: "Server error" }) };
            if (doc) { } // returns the update
            else { res.status(404).send({ message: "User " + element + " does not exist" }) }
          })
        })
    })
    ClassModel.create(req.body)
      .then(response => {
        // class successfully created, need to create 1 section now
        Section.create({
          courseCode: req.body.courseCode,
          className: req.body.className,
          sectionName: "Section 1",
          sectionSequence: 1,
          quizDetails: [],
          quizDuration: 10,
          sectionMaterial: []
        })
          .then(function (sectionCreated) {
            res.status(200).send([sectionCreated, response])
          })
          .catch(err => {
            res.status(500).send({ message: "Section creating error. " + err })
          });
      })
      .catch(err => {
        // console.log(response);
        res.status(500).send({ message: "Class creating error. " + err })
      });
  }
  else {
    res.status(400).send({ message: `Class ${req.body.courseCode} ${req.body.className} already exists!` })
  }
});

/**
 * @swagger
 * /class/quiz/{quizType}/{userID}:
 *  post:
 *    summary: Auto grade your quiz and update your user table if passed
 *    description: Automatically grade your quiz, returns boolean. (if passes, automatically adds to User CompletedCourses Field)
 *    tags: [class]
 *    parameters:
 *        - in: path
 *          name: quizType
 *          schema:
 *            type: string
 *          required: true
 *          description: Either "graded" or "ungraded" only
 *          example: graded
 *        - in: path
 *          name: userID
 *          schema:
 *            type: string
 *          required: true
 *          description: The User ID
 *          example: 1
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
 *              sectionName:
 *                type: string
 *                example: Ungraded Only**
 *              quizAnswers:
 *                type: array
 *                items:
 *                  answer:
 *                    type: string
 *                    example: print()                    
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
router.post('/class/quiz/:quizType/:userID', async function (req, res, next) {

  // Get answer in body
  let submittedAnswerList = req.body.quizAnswers;

  // Quiz Type -> Can only be "graded" or "ungraded"
  let quizType = req.params.quizType;

  // compare to quizDetails in Class
  let classDoc = await ClassModel.findOne({ courseCode: req.body.courseCode, className: req.body.className }).exec();
  let user = await User.findOne({ userID: req.params.userID }).exec();
  let courseDoc = await CourseModel.findOne({ courseCode: req.body.courseCode }).exec();

  if (classDoc && courseDoc) {
    if (user) {
      var quizDetails = [];
      var updatedQuizDetails = [];
      var marksObtained = 0;

      
      // Setting of variables
      if (quizType === "ungraded") {
        let sectionDoc = await Section.findOne({ courseCode: req.body.courseCode, className: req.body.className, sectionName: req.body.sectionName }).exec();
        if (sectionDoc === null || sectionDoc === []) {
          res.status(404).send({ message: "Unable to retrieve section" });
          return;
        }
        quizDetails = sectionDoc.quizDetails;
        updatedQuizDetails = sectionDoc.quizDetails;
      } else {
        quizDetails = classDoc.quizDetails;
        var passingMark = courseDoc.quizPassingMark; // it is in percentage
        updatedQuizDetails = classDoc.quizDetails;
      }

      
      if (submittedAnswerList.length == quizDetails.length) {
        // Calculating the total marks
        for (let i = 0; i < quizDetails.length; i++) {

          // Saving the selected option for each question
          updatedQuizDetails[i]["selected"] = submittedAnswerList[i];

          if (quizDetails[i].answer === submittedAnswerList[i]) {
            marksObtained += 1;
            updatedQuizDetails[i]["result"] = true;
          } else {
            updatedQuizDetails[i]["result"] = false;
          }
        }

        let marksOutput = marksObtained + "/" + quizDetails.length; // setting up the marks return output
        let results = (marksObtained / quizDetails.length) * 100; //  calculating the result

        if (quizType === "ungraded") {
          ProgressModel.findOneAndUpdate({ courseCode: req.body.courseCode, className: req.body.className, userID: req.params.userID }, { isSectionQuizComplete: true }, { new: true }, (err, doc) => {
            if (err) { res.status(500).send({ message: "Server error" }); return; };
            // status is always true -> ungraded quiz will always "pass"
            if (doc) { res.status(200).send({ status: true, marks: marksOutput, quizDetails: updatedQuizDetails }); return; }  // returns the update
            else { 
              ProgressModel.create(
                {
                  "courseCode": req.body.courseCode,
                  "className": req.body.className,
                  "sectionName": req.body.sectionName,
                  "userID": req.params.userID,
                  "sectionMaterialName": [],
                  "isSectionQuizComplete": true
                }
              )
              .then(function (doc) {
                res.status(200).send({ status: true, marks: marksOutput, quizDetails: updatedQuizDetails }); 
                return;
              })
              .catch(err => {
                res.status(500).send({ message: "Progress creating error. " + err });
                return;
              });
            }
          })
          
        } else { // graded
          if (results >= passingMark) { // Passed the quiz
            
            let userLearningCourses = user.learningCourses;
            let userCompletedCourses = user.completedCourses;
            var learningCoursesIndex = 0;
            var completed = false;

            for(let i = 0; i < userLearningCourses.length; i++) {
              if (req.body.courseCode == userLearningCourses[i].courseCode) {
                learningCoursesIndex = i;
              }
            }

            for (let i = 0; i < userCompletedCourses.length; i++) {
              if (userCompletedCourses[i][0] == req.body.courseCode) {
                completed = true;
              }
            }

            if (learningCoursesIndex > -1 || completed) { // checks that this course exist in user learningCourses && not completed field

              if (quizType == "graded" && !completed) { // only update user if its "graded"
                userLearningCourses.splice(learningCoursesIndex, 1);
                userCompletedCourses.push([req.body.courseCode, req.body.className, marksOutput]);
                user.learningCourses = userLearningCourses;
                user.completedCourses = userCompletedCourses

                await user.save(); // updating the user
              }
              res.status(200).send({ status: true, marks: marksOutput, quizDetails: updatedQuizDetails })
            } else {
              res.status(404).send({ message: "User has neither enrolled or completed the course" });
            }
          } else { // Quiz Failed
            res.status(200).send({ status: false, marks: marksOutput, quizDetails: updatedQuizDetails })
          }
        }
      } else { res.status(404).send({ message: "SubmittedQuizAnswer is not equal to quizDetails length" }) }
    } else { res.status(404).send({ message: "User " + req.params.userID + " do not exist." }) }
  } else { res.status(404).send({ message: "Either courseCode: " + req.body.courseCode + ", or className: " + req.body.className + ", do not exist." }) }
})

/**
 * @swagger
 * /class/quiz:
 *  put:
 *    summary: Update the graded class quiz
 *    description: Replaces the quizDetails in the database with your request body's quizDetails
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
router.put('/class/quiz', function (req, res, next) {
  let quizDetails = req.body.quizDetails;
  // console.log(req.body)
  // replaces the entire quiz details
  ClassModel.findOneAndUpdate({ courseCode: req.body.courseCode, className: req.body.className }, { quizDetails: quizDetails }, { new: true }, (err, doc) => {
    if (err) { res.status(500).send({ message: "Server error" }); return; };
    if (doc) { res.status(200).send(doc); } // returns the update
    else { res.status(404).send({ message: "Class " + req.body.className + " do not exist" }) }
  })
})

/**
 * @swagger
 * /class/enrolmentdate:
 *  put:
 *    summary: Update the class and enrolment dates
 *    description: Replaces the class and enrolment dates in the database with your request body's class and enrolment dates
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
 *              classStartDate:
 *                type: string
 *              classEndDate:
 *                type: string
 *              enrolmentStartDate:
 *                type: string
 *              enrolmentEndDate:
 *                type: string
 *            required:
 *              - courseCode
 *              - className
 *              - classStartDate
 *              - classEndDate
 *              - enrolmentStartDate
 *              - enrolmentEndDate
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Class XXX (className) do not exist
 *      '500':
 *        description: Server error.
 */
// Update a grade quiz for the class
router.put('/class/enrolmentdate', function (req, res, next) {
  ClassModel.findOneAndUpdate({ courseCode: req.body.courseCode, className: req.body.className },
    {
      classStartDate: req.body.classStartDate,
      classEndDate: req.body.classEndDate,
      enrolmentEndDate: req.body.enrolmentEndDate,
      enrolmentEndDate: req.body.enrolmentEndDate
    },
    { new: true }, (err, doc) => {
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
router.put('/class/enrol/:userID', async function (req, res, next) {
  let classDoc = await ClassModel.findOne({ courseCode: req.body.courseCode, className: req.body.className });
  let user = await User.findOne({ UserID: req.params.userID }).exec();
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
          learningCourses.push([req.body.courseCode, req.body.className]);

          // add the courseCode to the learningCourses array of the user
          User.findOneAndUpdate({ userID: req.params.userID }, { learningCourses: learningCourses }, { new: true }, (userErr, userDoc) => {
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
router.delete('/class/:courseCode/:className', function (req, res, next) {
  ClassModel.findOneAndDelete({ courseCode: req.params.courseCode, className: req.params.className })
    .exec()
    .then(function (c) {
      if (c !== null) {
        res.status(200).send("Class " + req.params.className + " deleted");
      } else {
        res.status(404).send({ message: "Class " + req.params.className + " do not exist" })
      }
    })
    .catch((res) => res.status(500).send({ message: "Server error" }));
});

module.exports = router;
