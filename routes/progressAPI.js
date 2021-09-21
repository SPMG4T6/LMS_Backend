const express = require('express');
const router = express.Router();
const Progress = require('../models/progress');

/**
 * @swagger
 * /allProgress:
 *  get:
 *    summary: Get a list of progresses
 *    tags: [progress]
 *    responses:
 *      '200':
 *        description: A successful response
 */
// get a list of all progresses made by students from the database
router.get('/allProgress',function(req,res,next) {
  Progress.find({})
    .then(function(progress){
        res.send(progress);
    })
    .catch(next);
});

/**
 * @swagger
 * /progress:
 *  post:
 *    summary: Create a progress data
 *    tags: [progress]
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
 *              courseMaterialID:
 *                type: array
 *                items:
 *                  type: string
 *            required:
 *              - courseName
 *              - className
 *              - sectionName
 *              - userID
 *    responses:
 *      '200':
 *        description: A successful response
 */
// add a new progress to database
router.post('/progress',function(req,res,next){
  Progress.create(req.body)
    .then(function(progress){
        res.send(progress);
    })
    .catch(next);
});

module.exports = router;
