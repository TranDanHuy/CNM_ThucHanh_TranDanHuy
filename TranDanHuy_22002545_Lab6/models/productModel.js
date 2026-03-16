const AWS = require('aws-sdk');

AWS.config.update({
    region: 'local',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'fakeMyKeyId',
    secretAccessKey: 'fakeSecretAccessKey'
});

const docClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Products';

module.exports = { docClient, TABLE_NAME, db: new AWS.DynamoDB() };