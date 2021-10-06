const express = require('express');
const router = express.Router();
const Section = require('../models/section');
const multer = require("multer");
const uploadController = require('./uploadController');


const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, "public/files");
  },
  filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      const fileName = file.originalname.split(".")[0];
      cb(null, `${fileName}.${ext}`);
  },
});

const upload = multer({
  storage: multerStorage
});

/**
 * @swagger
 * /sections:
 *  get:
 *    summary: Get a list of sections
 *    tags: [section]
 *    responses:
 *      '200':
 *        description: A successful response
 */
// get a list of all sections from the database
router.get('/sections',function(req,res,next) {
  Section.find({})
    .then(function(sections){
        res.send(sections);
    })
    .catch(next);
});

/**
 * @swagger
 * /sections/{courseCode}/{className}:
 *  get:
 *    summary: Get a list of sections within a specific class of a specific course
 *    tags: [section]
 *    responses:
 *      '200':
 *        description: A successful response
 */
// get a list of all sections within a specific class of a specific course
router.get('/sections/:courseCode/:className', function(req, res, next) {
  Section.find({"courseCode": req.params.courseCode, "className": req.params.className})
  .then(function(sections) {
    res.send(sections);
  })
  .catch(next);
}) 

/**
 * @swagger
 * /sections/{courseCode}/{className}/{sectionName}:
 *  get:
 *    summary: Get a specific section within a specific class of a specific course
 *    tags: [section]
 *    responses:
 *      '200':
 *        description: A successful response
 */
// get a section within a specific class of a specific course
router.get('/sections/:courseCode/:className/:sectionName', function(req, res, next) {
  Section.find({"courseCode": req.params.courseCode, "className": req.params.className, "sectionName": req.params.sectionName.replace("+", " ")})
  .then(function(sections) {
    res.send(sections);
  })
  .catch(next);
}) 

/**
 * @swagger
 * /section:
 *  post:
 *    summary: Create a section
 *    tags: [section]
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
 *              sectionSequence:
 *                type: integer
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
 *              sectionMaterial:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    materialName:
 *                      type: string
 *                    materialLink:
 *                      type: string
 *                      pattern: (https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})
 *                      example: www.google.com
 *            required:
 *              - courseCode
 *              - className
 *              - sectionName
 *              - sectionSequence
 *              - quizDetails
 *              - sectionMaterial
 *    responses:
 *      '200':
 *        description: A successful response
 */
// add a new section of class to database
router.post('/section',upload.array("myFile"), (req, res) => {
  uploadController(req)
  .then((response) => {
    const sectionMaterial = response;
    delete req.body.materialName;
    delete req.body.materialType;
    delete req.body.myURL;
    req.body["sectionMaterial"] = sectionMaterial;
    req.body["quizDetails"] = [];
    Section.create(req.body)
    .then(function(section) {
      console.log("section created");
      res.send(section);
    }) 
  }) 
});


/**
 * @swagger
 * /section/quiz/{courseCode}/{className}/{sectionName}:
 *  put:
 *    summary: Update ungraded quiz details
 *    description: Updates the quiz details by replacing the database quiz details with the request body
 *    tags: [section]
 *    parameters:
 *        - in: path
 *          name: courseCode
 *          schema:
 *            type: string
 *          required: true
 *          description: Course Code
 *          example: Programming for Xerox WorkCentre with Card Access and Integration
 *        - in: path
 *          name: className
 *          schema:
 *            type: string
 *          required: true
 *          description: Class Name
 *          example: G14
 *        - in: path
 *          name: sectionName 
 *          schema:
 *            type: string
 *          required: true
 *          description: Section Name
 *          example: Regression
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
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
 *                    duration:
 *                      type: integer
 *                      example: 10
  *            required:
  *              - courseCode
  *              - className
  *              - sectionName
  *              - quizDetails
 *    responses:
 *      '200':
 *        description: A successful response
 */
// Update an ungraded quiz for the section
router.put('/section/quiz/:courseCode/:className/:sectionName', async function(req,res,next){

  let quizDetails = req.body.quizDetails;

  // replaces the entire quiz details
  Section.findOneAndUpdate({courseCode: req.params.courseCode, className: req.params.className, sectionName: req.params.sectionName}, { quizDetails: quizDetails }, { new: true }, (err, doc) => {
    if (err) { res.status(404).json({ error: "Section not found" }) };
    res.send(doc);
  });
})

module.exports = router;
