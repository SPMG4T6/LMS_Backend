const express = require('express');
const router = express.Router();
const Course = require('../models/course');

/**
 * @swagger
 * /courses:
 *  get:
 *    summary: Get All Courses
 *    tags: [course]
 *    responses:
 *      '200':
 *        description: A successful response
 */
// get a list of all courses from the database
router.get('/courses',function(req,res,next) {
  Course.find({})
    .then(response => {
      if (response.length > 0) {
        res.status(200).send(response);
      }
      else {
        res.status(404).send({
          message: "No courses found!"
        })
      }
    })
    .catch(error => {
      res.status(500).send({
        message: "Server error"
      });
    });
});

/**
 * @swagger
 * /course/view/{courseCode}:
 *  get:
 *    summary: Get Courses by courseCode
 *    tags: [course]
 *    parameters:
 *        - in: path
 *          name: courseCode
 *          schema:
 *            type: string
 *          required: true
 *          description: The course's code
 *          example: IS216
 *          
 *    responses:
 *      '200':
 *        description: A successful response
 */
//get course details by courseCode
router.get('/course/view/:courseCode', function(req,res) {
  Course.find({'courseCode': req.params.courseCode})
  .then(response => {
    // console.log(response);
    if (response.length > 0) {
      res.status(200).send(response);
    }
    else {
      res.status(400).send({
        "message": "Course does not exist"
      })
    }
  })
  .catch(error => {
    res.status(500).send({
      message: "Server error"
    });
  });
});

/**
 * @swagger
 * /course:
 *  post:
 *    summary: Create a new course
 *    tags: [course]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              courseCode:
 *                type: string
 *                example: IS442
 *              courseTitle:
 *                type: string
 *              courseDescription:
 *                type: string
 *              prereqCourses:
 *                type: array
 *                items:
 *                  type: string
 *              quizPassingMark:
 *                type: string
 *                example: 70
 *            required:
 *              - courseCode
 *              - courseTitle
 *              - courseDescription
 *              - quizPassingMark
 *    responses:
 *      '200':
 *        description: A successful response
 */
// add a new course to database
router.post('/course', async function(req,res){
  // check if course already exists
  let searchResult = await Course.findOne({courseCode: req.body.courseCode});
  // console.log(searchResult);
  if (!searchResult) {
    Course.create(req.body)
      .then(function(course){
          res.status(200).send(course);
      })
      .catch(error => {
        res.status(500).send({
          message: "Server error"
        });
      });
  }
  else {
    res.status(400).send({
      "message": `Course already exists`
    });
  }
});

/**
 * @swagger
 * /course/{courseCode}:
 *  put:
 *    summary: Update a course detail
 *    description: Update a course detail (only course title and description and prereqs allowed for now) in the database
 *    tags: [course]
 *    parameters:
 *        - in: path
 *          name: courseCode
 *          schema:
 *            type: string
 *          required: true
 *          description: Course Code
 *          example: IS442
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              courseTitle:
 *                type: string
 *              courseDescription:
 *                type: string
 *              prereqCourses:
 *                type: array
 *                items:
 *                  type: string
 *              quizPassingMark:
 *                type: string
 *                example: 70
 *            required:
 *              - courseTitle
 *              - courseDescription
 *              - quizPassingMark
 *    responses:
 *      '200':
 *        description: A successful response
 */
// update a course detail (only course title and description and prereqs allowed for now) in the database
router.put('/course/:courseCode', async function(req,res) {
  let fieldsToUpdate = {
    courseTitle: req.body.courseTitle,
    courseDescription: req.body.courseDescription,
    prereqCourses: req.body.prereqCourses,
    quizPassingMark: req.body.quizPassingMark
  }
  
  // To remove blank fields
  for (const [key, value] of Object.entries(fieldsToUpdate)) {
    if (!value) {
      delete fieldsToUpdate[key]
    }
  }
  
  Course.findOneAndUpdate({courseCode: req.params.courseCode}, fieldsToUpdate, { new: true }, (err, doc) => {
    if (err) { res.status(500).send({ message: "Server error" }) }
    if (doc) {
      res.status(200).send(doc);
    } else {
      res.status(404).send({
        message: "Course does not exist"
      })
    }
  })
  
});

/**
 * @swagger
 * /course/delete/{courseCode}:
 *  delete:
 *    summary: Delete a course
 *    tags: [course]
 *    parameters:
 *        - in: path
 *          name: courseCode
 *          schema:
 *            type: string
 *          required: true
 *          description: The course code
 *    responses:
 *      '200':
 *        description: A successful response
 */
//delete a course from the database
router.delete('/course/delete/:courseCode', async function(req,res) {
  let searchResult = await Course.find({courseCode: req.params.courseCode});
  if (searchResult.length <= 0) {
    res.status(404).send({
      message: "Course does not exist"
    })
  }
  else {
    Course.findOneAndDelete({courseCode: req.params.courseCode})
    .then(response => {
      res.status(200).send({
        message: `Course ${req.params.courseCode} deleted`
      });
    })
    .catch(error => {
      res.status(500).send({
        message: "Server error"
      });
    })
  }
})

module.exports = router;
