const AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');

// The name of the bucket that you have created
// const BUCKET_NAME = 'spm-g4t6-is212';

// Initialize S3 interface
const s3 = new AWS.S3({});

const createNewBucket = (bucketName) => {

    const params = {
        Bucket: bucketName,
        CreateBucketConfiguration: {
            // Set your region here
            LocationConstraint: "us-east-2"
        }
    };
    s3.createBucket(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else {
            console.log('Bucket Created Successfully', data.Location);
            return data.Location;
        }
    });
}
createNewBucket("spm-g4t6-is212")
