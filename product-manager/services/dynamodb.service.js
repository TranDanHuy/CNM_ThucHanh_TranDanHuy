const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
  region: "ap-southeast-2"
});

const db = DynamoDBDocumentClient.from(client);
const TABLE = "Products";

module.exports = {
  getAll: () =>
    db.send(new ScanCommand({ TableName: TABLE })),

  getById: (id) =>
    db.send(new GetCommand({
      TableName: TABLE,
      Key: { id }
    })),

  create: (item) =>
    db.send(new PutCommand({
      TableName: TABLE,
      Item: item
    })),

  update: (id, data) =>
    db.send(new UpdateCommand({
      TableName: TABLE,
      Key: { id },
      UpdateExpression:
        "set #n=:n, price=:p, quantity=:q, url_image=:u",
      ExpressionAttributeNames: {
        "#n": "name"
      },
      ExpressionAttributeValues: {
        ":n": data.name,
        ":p": data.price,
        ":q": data.quantity,
        ":u": data.url_image
      }
    })),

  delete: (id) =>
    db.send(new DeleteCommand({
      TableName: TABLE,
      Key: { id }
    }))
};
