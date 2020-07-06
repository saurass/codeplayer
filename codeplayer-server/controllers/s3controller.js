const fs = require("fs");
const AWS = require('aws-sdk');;
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_IAM_KEY,
    secretAccessKey: process.env.AWS_IAM_SECRET
}
);

exports.saveFile = (filePath, fileKey) => {
    return new Promise((resolve, reject) => {
        s3.upload({
            Bucket: process.env.AWS_S3_BUCKET,
            Body: fs.createReadStream(filePath),
            Key: fileKey
        }, (err, data) => {
            resolve(data);
        });
    })
}

exports.saveText = (text, fileKey) => {
    return new Promise((resolve, reject) => {
        s3.upload({
            Bucket: process.env.AWS_S3_BUCKET,
            Body: text,
            Key: fileKey
        }, (err, data) => {
            resolve(data);
        });
    })
}

exports.readFile = (fileLink) => {
    return new Promise((resolve, reject) => {
        s3.getObject({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: fileLink
        }, (err, data) => {
            resolve(data.Body.toString());
        })
    });
}

exports.deleteFolder = async (fileKey) => {
    const listParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Prefix: fileKey
    };

    const listedObjects = await s3.listObjectsV2(listParams).promise();

    if (listedObjects.Contents.length === 0) return;

    const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Delete: { Objects: [] }
    };

    listedObjects.Contents.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key });
    });

    await s3.deleteObjects(deleteParams).promise();

    if (listedObjects.IsTruncated) await this.deleteFolder(fileKey);
}

exports.deleteFile = (fileKey) => {
    console.log(fileKey);
    return new Promise((resolve, reject) => {
        s3.deleteObject({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: fileKey
        }, (err, data) => {
            console.log(err);
            resolve(data);
        })
    })
}