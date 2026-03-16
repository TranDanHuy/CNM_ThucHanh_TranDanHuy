const { db, TABLE_NAME } = require('./models/productModel');

const params = {
    TableName: TABLE_NAME,
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
};

db.createTable(params, (err, data) => {
    if (err) {
        console.error("Lỗi tạo bảng:", JSON.stringify(err, null, 2));
    } else {
        console.log("Tạo bảng Products thành công!");
    }
});