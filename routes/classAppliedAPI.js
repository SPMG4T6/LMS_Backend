const express = require('express');
const router = express.Router();
const ClassApplied = require('../models/classApplied');

/**
 * @swagger
 * /allClassApplied:
 *  get:
 *    summary: Get a list of classes applied
 *    tags: [classApplied]
 *    responses:
 *      '200':
 *        description: A successful response
 */
// get a list all classes applied by all learners from the database regardless of status
router.get('/allClassApplied',function(req,res,next) {
  ClassApplied.find({})
    .then(function(classApplieds){
        res.send(classApplieds);
    })
    .catch(next);
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
 */
// get a list all classes applied by a specific learner from the database regardless of status
router.get('/userClassApplied/:userID',function(req,res,next) {
  ClassApplied.find({userID: req.params.userID})
    .then(function(classApplied){
        res.send(classApplied);
    })
    .catch(next);
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
 *          example: IS442
 *        - in: path
 *          name: className
 *          schema:
 *            type: string
 *          required: true
 *          description: Class Name
 *          example: G1
 *    responses:
 *      '200':
 *        description: A successful response
 */
// get a list all class applications for a particular class in a particular course from the database regardless of status
router.get('/classApplied/:courseCode/:className',function(req,res,next) {
  ClassApplied.find({courseCode: req.params.courseCode, className: req.params.className})
    .then(function(classApplied){
        res.send(classApplied);
    })
    .catch(next);
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
 *              status:
 *                type: string
 *                enum:
 *                - Pending
 *                - Approved
 *                - Rejected
 *    responses:
 *      '200':
 *        description: A successful response
 */
// add a new class application by student to database
router.post('/classApplied',function(req,res,next){
  ClassApplied.create(req.body)
    .then(function(classApplied){
        res.send(classApplied);
    })
    .catch(next);
});

module.exports = router;
