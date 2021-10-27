const express = require('express');
const router = express.Router();
const Progress = require('../models/progress');
const Section = require('../models/section');

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
 *      '500':
 *        description: Server error
 */
router.get('/progress/:userID', async function (req, res, next) {
  let searchResult = await Progress.findOne({ courseCode: req.body.courseCode, className: req.body.className, sectionName: req.body.sectionName });

  if (!searchResult) {
    Progress.find({ userID: req.params.userID })
    .then(function (progress) {
        res.status(200).send(progress)
    })
    .catch(res => {
        res.status(500).send({ "message": "Server error" })
    });
  } else {
    res.status(400).send({ message: `courseCode: ${req.body.courseCode}, className: ${req.body.className}, sectionName: ${req.body.sectionName}, already exists!` })
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
 * /progress/status/{courseCode}/{className}/{sectionName}/{userID}:
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
router.get('/progress/status/:courseCode/:className/:sectionName/:userID', async function (req, res, next) {
  let doc = await Progress.findOne({
    userID: req.params.userID,
    courseCode: req.params.courseCode,
    className: req.params.className,
    sectionName: req.params.sectionName
  })

  if (doc) {
    if (doc.isSectionQuizComplete) {
      res.status(200).send({ status: true })
    } else {
      
      let isComplete = false;
      let sectionDoc = await Section.findOne({ 
        courseCode: req.params.courseCode,
        className: req.params.className,
        sectionName: req.params.sectionName
      })

      if (sectionDoc) {
        if (sectionDoc.sectionMaterial.length === doc.sectionMaterialName.length && doc.isSectionQuizComplete) {
          isComplete = true;
        } 

        res.status(200).send({ status: isComplete })
      } else {
        res.status(404).send("Section do not exist");
      }
    }
  } else {
    res.status(404).send({ message: "Progress not found" })
  }
});

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
router.post('/progress', function (req, res, next) {
  Progress.create(req.body)
    .then(function (progress) {
        res.status(200).send(progress);
    })
    .catch(res => {
        res.status(500).send({ "message": "Server error" })
    });
});

// /**
//  * @swagger
//  * /progress/{courseCode}/{className}/{sectionName}/{userID}/{sectionMaterialName}:
//  *  delete:
//  *    summary: Delete a progress record
//  *    tags: [progress]
//  *    parameters:
//  *        - in: path
//  *          name: courseCode
//  *          schema:
//  *            type: string
//  *          required: true
//  *          description: The course code of the course
//  *        - in: path
//  *          name: className
//  *          schema:
//  *            type: string
//  *          required: true
//  *          description: The class name within the course
//  *        - in: path
//  *          name: sectionName
//  *          schema:
//  *            type: string
//  *          required: true
//  *          description: The section name within the class of the course
//  *        - in: path
//  *          name: userID
//  *          schema:
//  *            type: string
//  *          required: true
//  *          description: A user's ID
//  *        - in: path
//  *          name: sectionMaterialName
//  *          schema:
//  *            type: string
//  *          required: true
//  *          description: The specific section materials name in the section
//  *    responses:
//  *      '200':
//  *        description: A successful response
//  *      '404':
//  *        description: Progress record not found, not deleted
//  *      '500':
//  *        description: Server error
//  */
// // delete a progress record from the database
// router.delete('/progress/:courseCode/:className/:sectionName/:userID/:sectionMaterialName', function (req, res, next) {
//     Progress.findOneAndDelete({
//         userID: req.params.userID,
//         courseCode: req.params.courseCode,
//         className: req.params.className,
//         sectionName: req.params.sectionName,
//         sectionMaterialName: req.params.sectionMaterialName,
//     })
//         .then(function (progress) {
//             if (progress !== null) {
//                 res.status(200).send(progress);
//             } else {
//                 res.status(404).send({ "message": "No such record was found" });
//             }
//         })
//         .catch(res => {
//             res.status(500).send({ "message": "Server error" })
//         });
// });


module.exports = router;
