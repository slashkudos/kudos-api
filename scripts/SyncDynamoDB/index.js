const AWS = require("aws-sdk");

AWS.config.update({
  region: process.env.AWS_REGION || "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDb = new AWS.DynamoDB();
const dynamoDbDocClient = new AWS.DynamoDB.DocumentClient();

const listEnvironmentTables = async () => {
  let tableNames = [];

  while (true) {
    let response;
    try {
      response = await dynamoDb.listTables({}).promise();
    } catch (error) {
      throw error;
    }
    tableNames = tableNames.concat(response.TableNames);

    if (undefined === response.LastEvaluatedTableName) {
      break;
    } else {
      params.ExclusiveStartTableName = response.LastEvaluatedTableName;
    }
  }

  const environmentTablesMap = {};

  tableNames.forEach((tableName) => {
    const splitTable = tableName.split("-");
    const tableNameShort = splitTable[0];
    const environmentName = splitTable[splitTable.length - 1];
    if (!environmentTablesMap[environmentName]) {
      environmentTablesMap[environmentName] = [];
    }
    environmentTablesMap[environmentName].push({
      nameFull: tableName,
      nameShort: tableNameShort,
    });
  });

  return environmentTablesMap;
};

const getTableItems = async (tableName) => {
  let tableItems = [];
  const scanParams = { TableName: tableName };

  console.log(`Getting items from table ${tableName}...`);
  let data = {};
  do {
    try {
      data = await dynamoDbDocClient.scan(scanParams).promise();
      tableItems = tableItems.concat(data.Items);
      scanParams.ExclusiveStartKey = data.LastEvaluatedKey;
    } catch (error) {
      console.error("Unable to scan the table. Error: ", error);
      break;
    }
  } while (data.LastEvaluatedKey);
  console.log(`Retrieved ${tableItems.length} items from table ${tableName}`);
  return tableItems;
};

const deleteTableItem = async (tableName, itemId) => {
  try {
    await dynamoDbDocClient
      .delete({
        TableName: tableName,
        Key: {
          id: itemId,
        },
      })
      .promise();
  } catch (error) {
    console.error(
      `Unable to delete item ${itemId} from table ${tableName}. Error: ${error}`
    );
  }
};

const uploadTableItems = async (items, tableName) => {
  console.log(`Uploading ${items.length} items to table "${tableName}"...`);
  const requestItems = items.map((item) => {
    return { PutRequest: { Item: item } };
  });
  const maxBatchSize = 25;
  for (let i = 0; true; i++) {
    const startIndex = i * maxBatchSize;
    const batch = requestItems.slice(
      startIndex,
      Math.min(startIndex + maxBatchSize, requestItems.length)
    );
    if (batch.length === 0) {
      break;
    }
    console.log(`Writing batch ${i + 1} with ${batch.length} items...`);

    const params = { RequestItems: {} };
    params.RequestItems[tableName] = batch;

    try {
      await dynamoDbDocClient.batchWrite(params).promise();
      console.log("Added " + batch.length + " items to DynamoDB");
    } catch (error) {
      console.error(error);
      break;
    }
  }
};

const getTableNameForEnvironment = (
  envName,
  tableNameShort,
  environmentTables
) => {
  const envTableMatches = environmentTables.filter(
    (tableInfo) => tableInfo.nameShort === tableNameShort
  );

  if (envTableMatches.length === 0) {
    console.warn(`No table "${tableNameShort}" found for "${envName}"`);
    return undefined;
  }
  const envTableNameFull = envTableMatches[0].nameFull;
  return envTableNameFull;
};

const run = async () => {
  console.log("Beginning sync...");

  const validEnvironments = ["dev"];

  const envName = process.env.ENVIRONMENT;
  if (!envName || !validEnvironments.includes(envName)) {
    throw new Error(
      "ENVIRONMENT must be one of: " + validEnvironments.join(", ")
    );
  }

  const environmentTables = await listEnvironmentTables();
  console.debug(`Environment tables: ${JSON.stringify(environmentTables)}`);

  console.log("Getting production table items...");
  const prodTables = [];
  for (const tableInfo of environmentTables["prod"]) {
    let tableItems = await getTableItems(tableInfo.nameFull);
    prodTables.push({
      nameShort: tableInfo.nameShort,
      items: tableItems,
    });
  }

  for (const prodTable of prodTables) {
    // Get corresponding full name of env table
    const envTableNameFull = getTableNameForEnvironment(
      envName,
      prodTable.nameShort,
      environmentTables[envName]
    );

    // Clear the table
    console.log(`Deleting all items from table "${envTableNameFull}"...`);
    const tableItems = await getTableItems(envTableNameFull);
    for (const item of tableItems) {
      await deleteTableItem(envTableNameFull, item.id);
    }
    console.log(
      `Deleted ${tableItems.length} items from table "${envTableNameFull}"`
    );

    // // Populate the table
    await uploadTableItems(prodTable.items, envTableNameFull);
    console.log("Done.");
  }
  console.log("Sync complete.");
};

run();
