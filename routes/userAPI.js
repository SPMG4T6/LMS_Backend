const express = require('express');
const router = express.Router();
const User = require('../models/user');

/**
 * @swagger
 * /users:
 *  get:
 *    summary: Get a list of users
 *    tags: [user]
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Server error
 */
// get a list of all users from the database
router.get('/users', function (req, res, next) {
    User.find({})
        .then(function (users) {
            res.status(200).send(users);
        })
        .catch(res => {
            res.status(500).send({ "message": "Server error" })
        });
});

/**
 * @swagger
 * /user/{userID}:
 *  get:
 *    summary: Get a specific user
 *    tags: [user]
 *    parameters:
 *        - in: path
 *          name: userID
 *          schema:
 *            type: string
 *          required: true
 *          description: A user's ID
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: No user with specified userID was found
 *      '500':
 *        description: Server error
 */
router.get('/user/:userID', function (req, res, next) {
    User.find({ userID: req.params.userID })
        .then(function (users) {
            if (users.length > 0) {
                res.status(200).send(users);
            } else {
                res.status(404).send({ "message": "No user with specified userID was found" })
            }
        })
        .catch(res => {
            res.status(500).send({ "message": "Server error" })
        });
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
 *              learningCourses:
 *                type: array
 *                items:
 *                  type: string
 *              teachingCourses:
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
 *      '201':
 *        description: A successful response
 *      '400':
 *        description: Failed to add, userID already exists
 *      '500':
 *        description: Server error
 */
// add a new user to database
router.post('/user', async function (req, res, next) {
    let searchResult = await User.findOne({ userID: req.body.userID })
    if (!searchResult) {
        User.create(req.body)
            .then(function (user) {
                res.status(200).send(user);
            })
            .catch(res => {
                res.status(500).send({ "message": "Server error" })
            });
    } else {
        res.status(400).send({ "message": "UserID already exists!" })
    }
});

/**
 * @swagger
 * /user/{userID}:
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
 *              learningCourses:
 *                type: array
 *                items:
 *                  type: string
 *              teachingCourses:
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
 *      '404':
 *        description: User not found
 *      '500':
 *        description: Server error
 */
// update a user in the database
router.put('/user/:userID', function (req, res, next) {
    User.findOneAndUpdate({ userID: req.params.userID }, req.body, { new: true }, (err, doc) => {
        if (err) res.status(500).send({ "message": "Server error" });
        if (doc !== null) {
            res.status(200).send(doc);
        } else {
            res.status(404).send( {"message": "User not found"} )
        }
    });
});

/**
 * @swagger
 * /user/{userID}:
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
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Specified userID not found, not deleted
 *      '500':
 *        description: Server error
 */
// delete a user from the database
router.delete('/user/:userID', function (req, res, next) {
    User.findOneAndDelete({ userID: req.params.userID })
        .then(function (user) {
            if (user !== null) {
                res.status(200).send(user);
            } else {
                res.status(404).send({ "message": "No user with specified userID was found" });
            }
        })
        .catch(res => {
            res.status(500).send({ "message": "Server error" })
        });
});

module.exports = router;
