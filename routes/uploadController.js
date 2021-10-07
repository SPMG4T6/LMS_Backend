const uploadToS3 = require('./upload-to-s3');

const uploadController = (req) =>
    new Promise((resolve, reject) => {
        let sectionMaterial = [];
        let promiseArray = [];
        let toUploadCounter = 0;
        let urlCounter = 0;
        let folderName = req.body.courseCode + "." + req.body.className

        // array of file objects
        const filesArray = req.files;
        // console.log(filesArray);

        // array of the material name, matches filesArray by index
        const materialNameArray = req.body.materialName;

        // array of material type to track the index
        const materialTypeArray = req.body.materialType;

        // array of url types
        const urlArray = req.body.myURL;

        for (var i = 0; i < req.body.materialName.length; i++) {
            let materialObject = {};
            let currMaterialName = materialNameArray[i];
            let currMaterialType = materialTypeArray[i];
            if (currMaterialType == "uploadType") {
                toUploadCounter++;
                let file = filesArray[toUploadCounter-1];
                promiseArray.push(uploadToS3({materialName: currMaterialName, file: file, folderName: folderName}));
            }
            else if (currMaterialType == "urlType") {
                materialObject["materialName"] = currMaterialName;
                if (Array.isArray(urlArray)) {
                    urlCounter++;
                    materialObject["materialLink"] = urlArray[urlCounter-1];
                }
                else {
                    materialObject["materialLink"] = urlArray;
                }
                materialObject['type'] = 'urlType';
                sectionMaterial.push(materialObject);
            }
        }
        Promise.all(promiseArray)
        .then(response => {
            //response is an array of objects containing materialName and S3 URL
            for (let item of response) {
                let materialObject = {};
                materialObject['materialName'] = item.materialName;
                materialObject['materialLink'] = item.s3PubUrl;
                materialObject['materialType'] = "uploadType"
                sectionMaterial.push(materialObject);
            }
            resolve(sectionMaterial);

        })
    })

module.exports = uploadController;