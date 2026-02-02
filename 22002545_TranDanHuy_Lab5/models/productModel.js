const AWS = require("aws-sdk");
const TABLE_NAME = process.env.TABLE_NAME || "Products";

AWS.config.update({
  region: process.env.AWS_REGION || "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || "local",
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "local",
});

const dynamodb = new AWS.DynamoDB({ endpoint: process.env.DYNAMODB_ENDPOINT });
const docClient = new AWS.DynamoDB.DocumentClient({
  endpoint: process.env.DYNAMODB_ENDPOINT,
});

async function ensureTable() {
  const params = { TableName: TABLE_NAME };
  try {
    const data = await dynamodb.describeTable(params).promise();
    console.log("Table exists:", TABLE_NAME);
    return;
  } catch (err) {
    // If not found, create
    if (
      err.code === "ResourceNotFoundException" ||
      err.code === "ResourceNotFound"
    ) {
      console.log("Creating table:", TABLE_NAME);
      const createParams = {
        TableName: TABLE_NAME,
        KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
        AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
      };
      await dynamodb.createTable(createParams).promise();
      // wait for active
      await dynamodb
        .waitFor("tableExists", { TableName: TABLE_NAME })
        .promise();
      console.log("Table created and active:", TABLE_NAME);
      return;
    }
    throw err;
  }
}

async function createProduct(product) {
  const params = { TableName: TABLE_NAME, Item: product };
  return docClient.put(params).promise();
}

async function getProducts() {
  const params = { TableName: TABLE_NAME };
  const data = await docClient.scan(params).promise();
  return data.Items || [];
}

async function getProductById(id) {
  const params = { TableName: TABLE_NAME, Key: { id } };
  const data = await docClient.get(params).promise();
  return data.Item;
}

async function updateProduct(id, attrs) {
  const updateExpressions = [];
  const ExpressionAttributeNames = {};
  const ExpressionAttributeValues = {};
  let idx = 0;
  for (const k of Object.keys(attrs)) {
    idx++;
    const nameKey = `#k${idx}`;
    const valKey = `:v${idx}`;
    updateExpressions.push(`${nameKey} = ${valKey}`);
    ExpressionAttributeNames[nameKey] = k;
    ExpressionAttributeValues[valKey] = attrs[k];
  }
  const params = {
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: "SET " + updateExpressions.join(", "),
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: "ALL_NEW",
  };
  const res = await docClient.update(params).promise();
  return res.Attributes;
}

async function deleteProduct(id) {
  const params = { TableName: TABLE_NAME, Key: { id } };
  return docClient.delete(params).promise();
}

module.exports = {
  ensureTable,
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
