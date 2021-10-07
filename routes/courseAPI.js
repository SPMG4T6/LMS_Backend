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
    .then(function(courses){
        res.send(courses);
    })
    .catch(next);
});

/**
 * @swagger
 * /course/view/{courseCode}:
 *  get:
 *    summary: Get Courses by courseCode
 *    tags: [course]
 *    responses:
 *      '200':
 *        description: A successful response
 */
//get course details by courseCode
router.get('/course/view/:courseCode', function(req,res,next) {
  Course.find({'courseCode': req.params.courseCode})
  .then(function(course) {
    res.send(course)
  })
  .catch(next);
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
router.post('/course',function(req,res,next){
  Course.create(req.body)
    .then(function(course){
        res.send(course);
    })
    .catch(next);
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
router.put('/course/:courseCode',function(req,res) {
  let fieldsToUpdate = {
    courseTitle: req.body.courseTitle,
    courseDescription: req.body.courseDescription,
    prereqCourses: req.body.prereqCourses
  }
  
  // To remove blank fields
  for (const [key, value] of Object.entries(fieldsToUpdate)) {
    if (!value) {
      delete fieldsToUpdate[key]
    }
  }

  Course.findOneAndUpdate({courseCode: req.params.courseCode}, fieldsToUpdate, { new: true }, (err, doc) => {
    if (err) { res.status(404).json({ error: "Course not found" }) };
    res.send(doc);
  })
  
});


module.exports = router;
