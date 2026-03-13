const {
  ScanCommand,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
const { dynamo } = require("../config/aws");
const { v4: uuidv4 } = require("uuid");

const tableName = "products";

exports.search = async (keyword) => {
  const data = await dynamo.send(
    new ScanCommand({
      TableName: tableName,
      FilterExpression: "contains(#n, :keyword)",
      ExpressionAttributeNames: {
        "#n": "name",
      },
      ExpressionAttributeValues: {
        ":keyword": keyword,
      },
    }),
  );

  return data.Items;
};

exports.getAll = async () => {
  const data = await dynamo.send(
    new ScanCommand({
      TableName: tableName,
    }),
  );

  return data.Items;
};

exports.create = async (product) => {
  await dynamo.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        id: uuidv4(),
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: product.quantity,
      },
    }),
  );
};

exports.getById = async (id) => {
  const data = await dynamo.send(
    new GetCommand({
      TableName: tableName,
      Key: { id },
    }),
  );

  return data.Item;
};

exports.update = async (product) => {
  await dynamo.send(
    new UpdateCommand({
      TableName: tableName,
      Key: { id: product.id },
      UpdateExpression: "set #n=:n, price=:p, quantity=:q, image=:i",
      ExpressionAttributeNames: {
        "#n": "name",
      },
      ExpressionAttributeValues: {
        ":n": product.name,
        ":p": product.price,
        ":q": product.quantity,
        ":i": product.image,
      },
    }),
  );
};

exports.delete = async (id) => {
  await dynamo.send(
    new DeleteCommand({
      TableName: tableName,
      Key: { id },
    }),
  );
};
