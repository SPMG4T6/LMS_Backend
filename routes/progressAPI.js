const express = require('express');
const router = express.Router();
const Progress = require('../models/progress');
const Section = require('../models/section');
const User = require('../models/user');
const returnCompletedSection = require('./returnCompletedSection');

/**
 * @swagger
 * /progress:
 *  get:
 *    summary: Get a list of progresses
 *    tags: [progress]
 *    responses:
 *      '200':
 *        description: A successful response
 */
// get a list of all progresses made by students from the database
router.get('/progress', function (req, res, next) {
    Progress.find({})
        .then(function (progress) {
            res.status(200).send(progress);
        })
        .catch(res => {
            res.status(500).send({ "message": "Server error" })
        });
});

/**
 * @swagger
 * /progress/{userID}:
 *  get:
 *    summary: Get all progress by specific user
 *    tags: [progress]
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
 *        description: User not found
 *      '500':
 *        description: Server error
 */
router.get('/progress/:userID', async function (req, res, next) {
    let searchResult = await User.findOne({ userID: req.params.userID });
    if (!searchResult) {
        res.status(404).send({ "message": `User ID ${req.params.userID} does not exist` })
    } else {
        Progress.find({ userID: req.params.userID })
            .then(function (progress) {
                res.status(200).send(progress)
            })
            .catch(res => {
                res.status(500).send({ "message": "Server error" })
            });
    }
});

/**
 * @swagger
 * /progress/{courseCode}/{className}/{userID}:
 *  get:
 *    summary: GET all progress by of a specific user within a class of a course
 *    tags: [progress]
 *    parameters:
 *        - in: path
 *          name: courseCode
 *          schema:
 *            type: string
 *          required: true
 *          example: CS555
 *          description: The course code of the course
 *        - in: path
 *          name: className
 *          schema:
 *            type: string
 *          required: true
 *          example: G1
 *          description: The class name within the course
 *        - in: path
 *          name: userID
 *          schema:
 *            type: string
 *          required: true
 *          example: 1
 *          description: A user's ID
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Server error
 */
// Return an array of sections in a course & class of a specific user
router.get('/progress/:courseCode/:className/:userID', function (req, res, next) {
    Progress.find({
        userID: req.params.userID,
        courseCode: req.params.courseCode,
        className: req.params.className,
    })
        .then(function (progress) {
            res.status(200).send(progress)
        })
        .catch(res => {
            res.status(500).send({ "message": "Server error" })
        });
});

/**
 * @swagger
 * /progress/{courseCode}/{className}/{sectionName}/{userID}:
 *  get:
 *    summary: Get all progress by specific user within a specific section of a class of a course
 *    tags: [progress]
 *    parameters:
 *        - in: path
 *          name: courseCode
 *          schema:
 *            type: string
 *          required: true
 *          description: The course code of the course
 *        - in: path
 *          name: className
 *          schema:
 *            type: string
 *          required: true
 *          description: The class name within the course
 *        - in: path
 *          name: sectionName
 *          schema:
 *            type: string
 *          required: true
 *          description: The section name within the class of the course
 *        - in: path
 *          name: userID
 *          schema:
 *            type: string
 *          required: true
 *          description: A user's ID
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Server error
 */
router.get('/progress/:courseCode/:className/:sectionName/:userID', async function (req, res, next) {
    let doc = await Progress.findOne({
        userID: req.params.userID,
        courseCode: req.params.courseCode,
        className: req.params.className,
        sectionName: req.params.sectionName
    })

    if (doc) {
        res.status(200).send(doc)
    } else {
        res.status(404).send({ message: "Progress not found" })
    }
});

/**
 * @swagger
 * /progress/completedSections/retrieve/{courseCode}/{className}/{userID}:
 *  get:
 *    summary: Get list of completed sections for a specified course, class and user
 *    tags: [progress]
 *    parameters:
 *        - in: path
 *          name: courseCode
 *          schema:
 *            type: string
 *          required: true
 *          description: The course code of the course
 *        - in: path
 *          name: className
 *          schema:
 *            type: string
 *          required: true
 *          description: The class name within the course
 *        - in: path
 *          name: userID
 *          schema:
 *            type: string
 *          required: true
 *          description: A user's ID
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Server error
 */
// Return an array of completed sections
router.get("/progress/completedSections/retrieve/:courseCode/:className/:userID", async function (req, res, next) {
    let sectionSearch = await Section.find({ courseCode: req.params.courseCode, className: req.params.className });
    let progressSearch = await Progress.find({ courseCode: req.params.courseCode, className: req.params.className, userID: req.params.userID })

    returnCompletedSection({ sections: sectionSearch, progresses: progressSearch })
        .then(response => {
            if (response.length > 0) {
                res.status(200).send(response);
            }
            else {
                res.status(404).send({
                    message: `No completed sections for ${req.params.userID} for ${req.params.courseCode} ${req.params.className}`
                })
            }
        })
        .catch(err => {
            res.status(500).send(err);
        })
})

/**
 * @swagger
 * /progress:
 *  post:
 *    summary: Create a progress record
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
 *              sectionName:
 *                type: string
 *              userID:
 *                type: string
 *              sectionMaterialName:
 *                type: array
 *                default: []
 *              isSectionQuizComplete:
 *                type: boolean
 *                default: false
 *            required:
 *              - courseCode
 *              - className
 *              - sectionName
 *              - userID
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Server error
 */
// add a new progress to database
router.post('/progress', async function (req, res, next) {
    let searchResult = await Progress.findOne({ courseCode: req.body.courseCode, className: req.body.className, sectionName: req.body.sectionName, userID: req.body.userID })
    if (!searchResult) {
        Progress.create(req.body)
            .then(function (progress) {
                res.status(200).send(progress);
            })
            .catch(res => {
                res.status(500).send({ "message": "Server error" })
            });
    } else {
        res.status(400).send({ "message": "Progress record already exists!" })
    }
});

/**
 * @swagger
 * /progress:
 *  put:
 *    summary: Updates a sectionMaterial into existing progress record, creates progress record if does not exist.
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
 *                default: "IS442"
 *              className:
 *                type: string
 *                default: "G14"
 *              sectionName:
 *                type: string
 *                default: "Machine Learning"
 *              userID:
 *                type: string
 *                default: "1"
 *              sectionMaterialName:
 *                type: string
 *                default: "Scrum Primer"
 *            required:
 *              - courseCode
 *              - className
 *              - sectionName
 *              - userID
 *              - sectionMaterialName
 *    responses:
 *      '200':
 *        description: Updated Progress record
 *      '500':
 *        description: Server error
 */
// updates a progress record, otherwise add a new progress to database
router.put('/progress', async function (req, res, next) {
    let progressResult = await Progress.findOne({
        courseCode: req.body.courseCode,
        className: req.body.className,
        sectionName: req.body.sectionName,
        userID: req.body.userID
    });

    if (progressResult) {
        // progress exists
        if (progressResult.sectionMaterialName.includes(req.body.sectionMaterialName)) {
            // section material already inside
            res.status(200).send(progressResult)
        } else {
            // section material not inside yet
            progressResult.sectionMaterialName.push(req.body.sectionMaterialName)
            Progress.findOneAndUpdate({
                courseCode: req.body.courseCode,
                className: req.body.className,
                sectionName: req.body.sectionName,
                userID: req.body.userID
            }, { sectionMaterialName: progressResult.sectionMaterialName }, { new: true })
                .then(function (progressUpdated) {
                    res.status(200).send(progressUpdated);
                })
                .catch(res => {
                    res.status(500).send({ "message": "Server error" })
                })
        }
    } else {
        // progress does not exist
        Progress.create(req.body)
            .then(function (progressCreated) {
                res.status(200).send(progressCreated);
            })
            .catch(res => {
                res.status(500).send({ "message": "Server error" })
            });
    }
});

/**
 * @swagger
 * /progress/quiz:
 *  put:
 *    summary: Updates quiz to pass, creates record with passed quiz if does not exist.
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
 *                default: "IS442"
 *              className:
 *                type: string
 *                default: "G14"
 *              sectionName:
 *                type: string
 *                default: "Machine Learning"
 *              userID:
 *                type: string
 *                default: "1"
 *            required:
 *              - courseCode
 *              - className
 *              - sectionName
 *              - userID
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Server error
 */
// updates a progress record, otherwise add a new progress to database
router.put('/progress/quiz', async function (req, res, next) {
    let progressResult = await Progress.findOne({
        courseCode: req.body.courseCode,
        className: req.body.className,
        sectionName: req.body.sectionName,
        userID: req.body.userID
    });

    if (progressResult) {
        // progress exists, update quiz to pass
        progressResult.sectionMaterialName.push(req.body.sectionMaterialName)
        Progress.findOneAndUpdate({
            courseCode: req.body.courseCode,
            className: req.body.className,
            sectionName: req.body.sectionName,
            userID: req.body.userID
        }, { isSectionQuizComplete: true }, { new: true })
            .then(function (progressUpdated) {
                res.status(200).send(progressUpdated);
            })
            .catch(res => {
                res.status(500).send({ "message": "Server error" })
            })
    } else {
        // progress does not exist
        Progress.create({
            courseCode: req.body.courseCode,
            className: req.body.className,
            sectionName: req.body.sectionName,
            userID: req.body.userID,
            isSectionQuizComplete: true
        })
            .then(function (progressCreated) {
                res.status(200).send(progressCreated);
            })
            .catch(res => {
                res.status(500).send({ "message": "Server error" })
            });
    }
});

/**
 * @swagger
 * /progress/{courseCode}/{className}/{sectionName}/{userID}:
 *  delete:
 *    summary: Delete a progress record
 *    tags: [progress]
 *    parameters:
 *        - in: path
 *          name: courseCode
 *          schema:
 *            type: string
 *          required: true
 *          description: The course code of the course
 *        - in: path
 *          name: className
 *          schema:
 *            type: string
 *          required: true
 *          description: The class name within the course
 *        - in: path
 *          name: sectionName
 *          schema:
 *            type: string
 *          required: true
 *          description: The section name within the class of the course
 *        - in: path
 *          name: userID
 *          schema:
 *            type: string
 *          required: true
 *          description: A user's ID
 *        - in: path
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Progress record not found, not deleted
 *      '500':
 *        description: Server error
 */
// delete a progress record from the database
router.delete('/progress/:courseCode/:className/:sectionName/:userID', function (req, res, next) {
    Progress.findOneAndDelete({
        userID: req.params.userID,
        courseCode: req.params.courseCode,
        className: req.params.className,
        sectionName: req.params.sectionName
    })
        .then(function (progress) {
            if (progress !== null) {
                res.status(200).send({ "message": "Progress record deleted" });
            } else {
                res.status(404).send({ "message": "No such record was found" });
            }
        })
        .catch(res => {
            res.status(500).send({ "message": "Server error" })
        });
});


module.exports = router;
