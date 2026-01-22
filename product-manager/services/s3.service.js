const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");

const s3 = new S3Client({
  region: "ap-southeast-2"
});

const BUCKET = "product-images-xuansang";

module.exports.uploadImage = async (file) => {
  const stream = fs.createReadStream(file.path);
  const key = Date.now() + "-" + file.originalname;

  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: stream,
    ContentType: file.mimetype
  }));

  fs.unlinkSync(file.path);

  return `https://${BUCKET}.s3.amazonaws.com/${key}`;
};
