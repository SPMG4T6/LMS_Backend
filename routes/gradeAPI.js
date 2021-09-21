const express = require('express');
const router = express.Router();
const Grade = require('../models/grade');

/**
 * @swagger
 * /grades:
 *  get:
 *    summary: Get a list of grades
 *    tags: [grade]
 *    responses:
 *      '200':
 *        description: A successful response
 */
// get a list of all grades from the database
router.get('/grades',function(req,res,next) {
  Grade.find({})
    .then(function(grades){
        res.send(grades);
    })
    .catch(next);
});

/**
 * @swagger
 * /grade:
 *  post:
 *    summary: Create a new grade of quiz
 *    tags: [grade]
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              courseName:
 *                type: string
 *              className:
 *                type: string
 *              sectionName:
 *                type: string
 *              userID:
 *                type: string
 *              obtainedScore:
 *                type: integer
 *                minimum: 0
 *              totalScore:
 *                type: integer
 *                minimum: 0
 *            required:
 *              - courseName
 *              - className
 *              - sectionName
 *              - userID
 *              - obtainedScore
 *              - totalScore
 *    responses:
 *      '200':
 *        description: A successful response
 */
// add a new grade of quiz to database
router.post('/grade',function(req,res,next){
  Grade.create(req.body)
    .then(function(grade){
        res.send(grade);
    })
    .catch(next);
});

module.exports = router;
