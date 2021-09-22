const express = require('express');
const router = express.Router();
const Section = require('../models/section');

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
 *              courseMaterial:
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
 *              - courseMaterial
 *    responses:
 *      '200':
 *        description: A successful response
 */
// add a new section of clahttps://elearn.smu.edu.sg/d2l/le/content/302948/viewContent/1827058/Viewss to database
router.post('/section',function(req,res,next){
  Section.create(req.body)
    .then(function(section){
        res.send(section);
    })
    .catch(next);
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
