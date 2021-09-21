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
 *                    option:
 *                      type: array
 *                      items:
 *                        type: integer
 *                    answer:
 *                      type: integer
 *              quizPassingMark:
 *                type: string
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
 *              required:
 *                - courseCode
 *                - className
 *                - sectionName
 *                - sectionSequence
 *                - quizDetails
 *                - quizPassingMark
 *                - courseMaterial
 *    responses:
 *      '200':
 *        description: A successful response
 */
// add a new section of class to database
router.post('/section',function(req,res,next){
  Section.create(req.body)
    .then(function(section){
        res.send(section);
    })
    .catch(next);
});

module.exports = router;
