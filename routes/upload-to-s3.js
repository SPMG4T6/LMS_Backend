const fs = require('fs');
const AWS = require('aws-sdk');
require('dotenv').config()

AWS.config.setPromisesDependency();
AWS.config.update({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY
});

const getParams = (file, contentType, folderName, materialName) => {
    return {
        Bucket: "spm-g4t6-is212",
        Key: `${folderName}/`+ materialName,
        Body: fs.createReadStream(file.path),
        ContentDisposition: 'inline; filename=' + materialName,
        ACL:'public-read',
        ContentType :contentType,
    };
};

const uploadToS3 = ({materialName, file, folderName}) => 
    new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error("File required!"));
        }
        const s3 = new AWS.S3();
        const fileType = file.originalname.split(".")[1];
        if (fileType == "pdf") {
            contentType = "application/pdf";
        }
        else if (fileType == "doc" | fileType == "docx") {
            contentType = "application/msword"
        }
        else if (fileType == "ppt" | fileType == "pptx") {
            contentType = "application/mspowerpoint";
        }
        else if (fileType == "xls" | fileType == "xlsx") {
            contentType = "application/mspowerpoint";
        }
        const params = getParams(file, contentType, folderName, materialName);
        s3.upload(params, (err, data) => {
            if (err) {
                reject(err);
            }
            if (data) {
                // fs.unlinkSync(file.path);
                let s3PubUrl = data.Location;
                resolve({materialName, s3PubUrl});
            }
        })
    });


module.exports = uploadToS3;