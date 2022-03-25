const AWS = require("aws-sdk");
const base64 = require("base-64");
const crypto = require("crypto-js");

AWS.config.update({
  region: process.env.AWS_REGION || "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html
function getSignatureKey(key, dateStamp, regionName, serviceName) {
  var kDate = crypto.HmacSHA256(dateStamp, "AWS4" + key);
  var kRegion = crypto.HmacSHA256(regionName, kDate);
  var kService = crypto.HmacSHA256(serviceName, kRegion);
  var kSigning = crypto.HmacSHA256("aws4_request", kService);
  return kSigning;
}

const bulkUpload = async (items, domainEndpoint) => {
  const { default: fetch } = await import("node-fetch");

  const itemsJson = JSON.stringify(items);

  console.log(`Uploading bulk data to ${domainEndpoint}/_bulk...`);
  console.log(itemsJson);

  const response = await fetch(`${domainEndpoint}/_bulk`, {
    method: "POST",
    body: itemsJson,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${base64.encode(
        process.env.AWS_USERNAME + ":" + process.env.AWS_PASSWORD
      )}`,
    },
  });
  const data = await response.json();

  console.log(data);
};

const onScan = (err, data, table, domainEndpoint) => {
  console.log(`Scanning ${table}...`);
  const params = { TableName: table };
  if (err) {
    console.error(
      "Unable to scan the table. Error JSON:",
      JSON.stringify(err, null, 2)
    );
  } else {
    // print all the items
    data.Items.forEach(function (item) {
      console.log(JSON.stringify(item));
    });

    // continue scanning if we have more items, because
    // scan can retrieve a maximum of 1MB of data
    if (typeof data.LastEvaluatedKey != "undefined") {
      console.log("Scanning for more...");
      params.ExclusiveStartKey = data.LastEvaluatedKey;
      docClient.scan(params, onScan(err, data, table, domainEndpoint));
    }
    console.log("Scan Done.");

    bulkUpload(data.Items, domainEndpoint);

    // curl -XPOST -u `master-user:master-user-password` `${domainEndpoint}/_bulk` --data-binary @bulk_movies.json -H 'Content-Type: application/json'
  }
};

const run = () => {
  const docClient = new AWS.DynamoDB.DocumentClient();

  const environments = {
    prod: {
      tables: [
        "Kudo-zw2r5gwxinglxmd3g3yvffwi2e-prod",
        "Person-zw2r5gwxinglxmd3g3yvffwi2e-prod",
      ],
      domainEndpoint:
        "https://search-amplify-opense-zw5tdkj8vf8h-urev7klv34ssmtlpcuqghu34fu.us-east-1.es.amazonaws.com",
    },
    dev: {
      tables: [
        "Kudo-bu7sog55jfdeboiekpcjbz5caa-dev",
        "Person-bu7sog55jfdeboiekpcjbz5caa-dev",
      ],
      domainEndpoint:
        "https://search-amplify-opense-fnm44qdkbci8-skusq2fjri67nkpov5vhxfbvjy.us-east-1.es.amazonaws.com",
    },
  };

  if (
    !process.env.ENVIRONMENT ||
    !Object.keys(environments).includes(process.env.ENVIRONMENT)
  ) {
    throw new Error(
      "ENVIRONMENT must be one of: " + Object.keys(environments).join(", ")
    );
  }

  const environment = environments[process.env.ENVIRONMENT];

  for (const table of environment.tables) {
    docClient.scan({ TableName: table }, (err, data) =>
      onScan(err, data, table, environment.domainEndpoint)
    );
  }
};

run();
