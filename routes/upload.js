const fs = require('fs');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');


// The name of the bucket that you have created
// const BUCKET_NAME = 'spm-g4t6-is212';

// Initialize S3 interface
const s3 = new AWS.S3({});

const uploadFile = (fileName, bucketName) => {

    const fileType = fileName.split(".")[1];
    if (fileType == "pdf") {
        contentType = "application/pdf";
    }
    else if (fileType == "doc" | fileType == "docx") {
        contentType = "application/msword"
    }
    else if (fileType == "ppt" ) {
        contentType = "application/mspowerpoint";
    }
    else if (fileType == "xls" | fileType == "xlsx") {
        contentType = "application/mspowerpoint";
    }

    // Read content from the file
    const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
        Bucket: bucketName,
        Key: fileName, // File name you want to save as in S3
        Body: fileContent,
        ContentType :contentType,
        ContentDisposition: 'inline; filename=' + fileName,
        ACL:'public-read'
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
        const s3PubUrl = data.location;
        return s3PubUrl;
    });
};
uploadFile("test.docx", "spm-g4t6-is212");