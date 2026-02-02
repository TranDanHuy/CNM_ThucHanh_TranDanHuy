/**
 * DynamoDB Tables Setup Script
 * Chạy script này để tạo các bảng DynamoDB
 * 
 * Usage: node scripts/setup-dynamodb.js
 */

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { CreateTableCommand, DescribeTableCommand } = require("@aws-sdk/client-dynamodb");

const REGION = process.env.AWS_REGION || "ap-southeast-1";
const client = new DynamoDBClient({ region: REGION });

const tables = [{
        TableName: "Users",
        KeySchema: [
            { AttributeName: "userId", KeyType: "HASH" }
        ],
        AttributeDefinitions: [
            { AttributeName: "userId", AttributeType: "S" }
        ],
        BillingMode: "PAY_PER_REQUEST"
    },
    {
        TableName: "Categories",
        KeySchema: [
            { AttributeName: "categoryId", KeyType: "HASH" }
        ],
        AttributeDefinitions: [
            { AttributeName: "categoryId", AttributeType: "S" }
        ],
        BillingMode: "PAY_PER_REQUEST"
    },
    {
        TableName: "Products",
        KeySchema: [
            { AttributeName: "id", KeyType: "HASH" }
        ],
        AttributeDefinitions: [
            { AttributeName: "id", AttributeType: "S" }
        ],
        BillingMode: "PAY_PER_REQUEST"
    },
    {
        TableName: "ProductLogs",
        KeySchema: [
            { AttributeName: "logId", KeyType: "HASH" }
        ],
        AttributeDefinitions: [
            { AttributeName: "logId", AttributeType: "S" }
        ],
        BillingMode: "PAY_PER_REQUEST"
    },
    {
        TableName: "Orders",
        KeySchema: [
            { AttributeName: "orderId", KeyType: "HASH" }
        ],
        AttributeDefinitions: [
            { AttributeName: "orderId", AttributeType: "S" }
        ],
        BillingMode: "PAY_PER_REQUEST"
    },
    {
        TableName: "OrderItems",
        KeySchema: [
            { AttributeName: "itemId", KeyType: "HASH" }
        ],
        AttributeDefinitions: [
            { AttributeName: "itemId", AttributeType: "S" }
        ],
        BillingMode: "PAY_PER_REQUEST"
    }
];

async function tableExists(tableName) {
    try {
        await client.send(new DescribeTableCommand({ TableName: tableName }));
        return true;
    } catch (error) {
        if (error.name === "ResourceNotFoundException") {
            return false;
        }
        throw error;
    }
}

async function createTable(tableConfig) {
    try {
        const exists = await tableExists(tableConfig.TableName);

        if (exists) {
            console.log(`✅ Table ${tableConfig.TableName} already exists`);
            return;
        }

        await client.send(new CreateTableCommand(tableConfig));
        console.log(`✅ Created table: ${tableConfig.TableName}`);
    } catch (error) {
        console.error(`❌ Error creating table ${tableConfig.TableName}:`, error.message);
    }
}

async function setupTables() {
    console.log("🚀 Starting DynamoDB tables setup...\n");

    for (const table of tables) {
        await createTable(table);
    }

    console.log("\n✅ Setup completed!");
    console.log("\n📝 Tables created:");
    tables.forEach(t => console.log(`   - ${t.TableName}`));

    console.log("\n💡 Next steps:");
    console.log("   1. Run: npm start");
    console.log("   2. Login with: admin / admin123");
    console.log("   3. Add categories and products");
}

setupTables().catch(console.error);