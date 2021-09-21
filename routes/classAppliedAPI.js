const express = require('express');
const router = express.Router();
const ClassApplied = require('../models/classApplied');

/**
 * @swagger
 * /classApplieds:
 *  get:
 *    summary: Get a list of classes applied
 *    tags: [classApplied]
 *    responses:
 *      '200':
 *        description: A successful response
 */
// get a list all classes applied by learners from the database regardless of status
router.get('/classApplieds',function(req,res,next) {
  ClassApplied.find({})
    .then(function(classApplieds){
        res.send(classApplieds);
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
 *              className:
 *                type: string
 *              courseName:
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
