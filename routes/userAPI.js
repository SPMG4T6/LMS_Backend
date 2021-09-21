const express = require('express');
const router = express.Router();
const Student = require('../models/user');

/**
 * @swagger
 * /users:
 *  get:
 *    summary: Get a list of users
 *    tags: [user]
 *    responses:
 *      '200':
 *        description: A successful response
 */
// get a list of all users from the database
router.get('/users',function(req,res,next) {
    Student.find({})
    .then(function(students){
        res.send(students);
    })
    .catch(next);
});

/**
 * @swagger
 * /user:
 *  post:
 *    summary: Create a user
 *    tags: [user]
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              userID:
 *                type: string
 *              userName:
 *                type: string
 *              userType:
 *                type: string
 *                enum:
 *                - learner
 *                - hr
 *                - trainer
 *              involvedCourses:
 *                type: array
 *                items:
 *                  type: string
 *              completedCourses:
 *                type: array
 *                items:
 *                  type: string
 *          required:
 *            - userID
 *            - userName
 *            - userType
 *            - involvedCourses
 *            - completedCourses
 *    responses:
 *      '200':
 *        description: A successful response
 */
// add a new user to database
router.post('/user',function(req,res,next){
    Student.create(req.body)
    .then(function(student){
        res.send(student);
    })
    .catch(next);
});

/**
 * @swagger
 * /user/:userID:
 *  put:
 *    summary: Update a user
 *    tags: [user]
 *    parameters:
 *        - in: path
 *          name: userID
 *          schema:
 *            type: string
 *          required: true
 *          description: A user's ID
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              userID:
 *                type: string
 *              userName:
 *                type: string
 *              userType:
 *                type: string
 *                enum:
 *                - learner
 *                - hr
 *                - trainer
 *              involvedCourses:
 *                type: array
 *                items:
 *                  type: string
 *              completedCourses:
 *                type: array
 *                items:
 *                  type: string
 *          required:
 *            - userID
 *            - userName
 *            - userType
 *            - involvedCourses
 *            - completedCourses
 *    responses:
 *      '200':
 *        description: A successful response
 */
// update a user in the database
router.put('/user/:id',function(req,res,next){
    Student.findOneAndUpdate({_id: req.params.id},req.body)
    .then(function(student){
        Student.findOne({_id: req.params.id}).then(function(student){
            res.send(student);
        });
    });
});

/**
 * @swagger
 * /user/:userID:
 *  delete:
 *    summary: Delete a user
 *    tags: [user]
 *    parameters:
 *        - in: path
 *          name: userID
 *          schema:
 *            type: string
 *          required: true
 *          description: A user's ID
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              userID:
 *                type: string
 *              userName:
 *                type: string
 *          required:
 *            - userID
 *            - userName
 *    responses:
 *      '200':
 *        description: A successful response
 */
// delete a user from the database
router.delete('/user/:id',function(req,res,next){
    Student.findOneAndDelete({_id: req.params.id})
    .then(function(student){
        res.send(student);
    });
});

module.exports = router;
