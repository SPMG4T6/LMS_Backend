const express = require('express');
const router = express.Router();
const Section = require('../models/section');
const multer = require("multer");
const uploadController = require('./uploadController');
const Class = require('../models/class');

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
router.get('/sections', function (req, res, next) {
  Section.find({})
    .then(function (sections) {
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
 *    responses:
 *      '200':
 *        description: A successful response
 */
// get a list of all sections within a specific class of a specific course
router.get('/sections/:courseCode/:className', function (req, res, next) {
  Section.find({ "courseCode": req.params.courseCode, "className": req.params.className })
    .then(function (sections) {
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
 *    responses:
 *      '200':
 *        description: A successful response
 */
// get a section within a specific class of a specific course
router.get('/sections/:courseCode/:className/:sectionName', function (req, res, next) {
  Section.find({ "courseCode": req.params.courseCode, "className": req.params.className, "sectionName": req.params.sectionName.split("+").join(" ") })
    .then(response => {
      if (response.length > 0) {
        res.status(200).send(response);
      }
      else {
        res.status(404).send({
          message: "No section found"
        })
      }
    })
    .catch(err => {
      res.status(500).send(err);
    });
})

/**
 * @swagger
 * /section/material/{courseCode}/{className}/{sectionName}/{materialName}:
 *  get:
 *    summary: Get section material's link
 *    description: Retrieve the material link
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
 *        - in: path
 *          name: materialName
 *          schema:
 *            type: string
 *          required: true
 *          description: Name of the Material
 *          example: Regression Notes
 *    responses:
 *      '200':
 *        description: A successful response
 */
// Returning the specific document hyperlink
router.get('/section/material/:courseCode/:className/:sectionName/:materialName', async function (req, res, next) {
  const doc = await Section.findOne({ courseCode: req.params.courseCode, className: req.params.className, sectionName: req.params.sectionName })
  let found = false;
  if (!doc) {
    res.status(404).json({ error: "Section does not exist " + req.params.materialName });
  } else {
    const materialName = req.params.materialName;
    for (let i = 0; i < doc.sectionMaterial.length; i++) {
      if (doc.sectionMaterial[i].materialName == materialName) {
        found = true;
        res.status(200).send(doc.sectionMaterial[i].materialLink)
      }
    }
    if (!found) {
      res.status(404).send({
        message: "Material does not exist"
      })
    }
  }

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
 *                example: 1
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
 *              quizDuration:
 *                type: integer
 *                example: 10
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
 *                    materialType:
 *                      type: string
 *                      enum:
 *                      - urlType
 *                      - uploadType
 *                      example: urlType
 *            required:
 *              - courseCode
 *              - className
 *              - sectionName
 *              - sectionSequence
 *              - quizDetails
 *              - quizDuration
 *              - sectionMaterial
 *    responses:
 *      '200':
 *        description: A successful response
 */
// add a new section of class to database
router.post('/section', upload.array("myFile"), async (req, res) => {
  let classDoc = await Class.findOne({courseCode: req.body.courseCode, className: req.body.className});
  if (!classDoc) {
    res.status(400).send({
      message: `Class does not exist`
    })
  } else {
    let sectionDoc = await Section.findOne({courseCode: req.body.courseCode, className: req.body.className, sectionName: req.body.sectionName});
    if (sectionDoc) {
      res.status(400).send({
        message: "Section already exists"
      })
    } else {
      uploadController(req)
        .then((response) => {
          const sectionMaterial = response;
    
          delete req.body.materialName;
          delete req.body.materialType;
          delete req.body.myURL;
          req.body["sectionMaterial"] = sectionMaterial;
          req.body["quizDetails"] = [];
          req.body["quizDuration"] = 10;
          Section.create(req.body)
            .then(function (section) {
              // console.log("section created");
              res.status(200).send(section);
            })
            .catch(function (error) {
              console.log(error);
              res.status(500).send({
                message: "Server error",
                data: error
              })
            })
        })
    }
  }
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
 *          example: IS442
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
router.put('/section/quiz/:courseCode/:className/:sectionName', async function (req, res) {

  let quizDetails = req.body.quizDetails;

  // replaces the entire quiz details
  Section.findOneAndUpdate({ courseCode: req.params.courseCode, className: req.params.className, sectionName: req.params.sectionName }, { quizDetails: quizDetails }, { new: true }, (err, doc) => {
    if (err) { res.status(404).json({ error: "Section not found" }); return; };
    if (!doc) {
      res.status(404).send({
        message: "Section not found"
      })
    }
    else {
      res.status(200).send(doc);
    }
  });
})

/**
 * @swagger
 * /section/updateMaterials:
 *  post:
 *    summary: Update section materials for a specific section
 *    description: Updates the section materials by replacing the database section materials with the request body. New materials need to be submitted using a form.
 *    tags: [section]
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
 *          example: G14
 *        - in: path
 *          name: sectionName 
 *          schema:
 *            type: string
 *          required: true
 *          description: Section Name
 *          example: Artificial+Intelligence
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
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
 *                    type:
 *                      type: string
 *                      enum:
 *                      - urlType
 *                      - uploadType
 *                      example: urlType
  *            required:
  *              - courseCode
  *              - className
  *              - sectionName
  *              - sectionMaterial
 *    responses:
 *      '200':
 *        description: A successful response
 */
// Update section materials for a specific section
router.post('/section/updateMaterials', upload.array("myFile"), (req, res) => {

  // const sectionName = req.params.sectionName.replace("+", " ");
  Section.find({ courseCode: req.body.courseCode, className: req.body.className, sectionName: req.body.sectionName })
    .then(function (section) {
      let retrievedSectionMaterialArray = section[0].sectionMaterial;
      // console.log("retrievedSectionMaterialArray");
      // console.log(retrievedSectionMaterialArray);
      let retrievedMaterialNameArray = [];
      retrievedSectionMaterialArray.forEach(element => {
        let retrievedMaterialName = element['materialName'];
        retrievedMaterialNameArray.push(retrievedMaterialName);
      });

      uploadController(req)
        .then((response) => {
          const sectionMaterial = response;
          // console.log(sectionMaterial);
          sectionMaterial.forEach(element => {
            let materialName = element['materialName'];
            if (!retrievedMaterialNameArray.includes(materialName)) {
              retrievedSectionMaterialArray.push(element);
            }
            else {
              let obj = retrievedSectionMaterialArray.find((o, i) => {
                if (o.materialName == materialName) {
                  retrievedSectionMaterialArray[i] = element;
                }
              })
            }
          });
          // console.log("Final sectionMaterial to be updated");
          // console.log(retrievedSectionMaterialArray);

          Section.findOneAndUpdate({ courseCode: req.body.courseCode, className: req.body.className, sectionName: req.body.sectionName }, { sectionMaterial: retrievedSectionMaterialArray }, { new: true }, (err, doc) => {
            if (err) {
              res.status(404).json({ error: "Section not found" })
            };
            // console.log("Section Materials updated")
            res.send(doc);
          })
        })
        .catch(function (reason) {
          res.status(500).send(reason);
        })

    })
})

/**
 * @swagger
 * /section/delete/{courseCode}/{className}/{sectionName}:
 *  delete:
 *    summary: Delete a section
 *    tags: [section]
 *    parameters:
 *        - in: path
 *          name: courseCode
 *          schema:
 *            type: string
 *          required: true
 *          description: The course code
 *        - in: path
 *          name: className
 *          schema:
 *            type: string
 *          required: true
 *          description: The class name
 *        - in: path
 *          name: sectionName
 *          schema:
 *            type: string
 *          required: true
 *          description: The section name
 *    responses:
 *      '200':
 *        description: A successful response
 */
//delete a section from the database
router.delete('/section/delete/:courseCode/:className/:sectionName', async function (req, res) {
  let searchResult = await Section.find({ courseCode: req.params.courseCode, className: req.params.className, sectionName: req.params.sectionName });
  if (searchResult.length <= 0) {
    res.status(404).send({
      message: "Section does not exist"
    })
  }
  else {
    Section.findOneAndDelete({ courseCode: req.params.courseCode, className: req.params.className, sectionName: req.params.sectionName })
      .then(response => {
        res.status(200).send({
          message: `Section ${req.params.sectionName} from ${req.params.className} deleted`
        });
      })
      .catch(error => {
        res.status(500).send({
          message: "Server error"
        });
      })
  }
})

module.exports = router;
