const zipFolder = require("zip-folder");
const { BlobServiceClient } = require("@azure/storage-blob");
const fs = require("fs");
const moment = require("moment");
const azureConnection = require("./azure-credentials.json");

const buildName =
  moment(new Date()).subtract(3, "hours").format("DD-MM-YYYYTHH-mm-ss") +
  ".zip";

async function zipBuildFiles() {
  return new Promise((resolve, reject) => {
    zipFolder("./dist", buildName, function (err) {
      if (err) {
        console.log(err);
        reject();
      } else {
        resolve();
      }
    });
  });
}

async function pushFilesToAzure() {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    azureConnection.AZURE_CONNECTION
  );
  const containerClient = blobServiceClient.getContainerClient(
    azureConnection.AZURE_BUCKET
  );

  const contents = fs.readFileSync(`./${buildName}`, { encoding: "base64" });
  const data = Buffer.from(contents, "base64");

  const blockBlobClient = containerClient.getBlockBlobClient(buildName);
  const response = await blockBlobClient.uploadData(data, {
    blobHTTPHeaders: {
      blobContentType: "application/zip",
    },
  });
  if (response._response.status !== 201) {
    console.log(
      `Error uploading document ${blockBlobClient.name} to container ${blockBlobClient.containerName}`
    );
  }
  console.log("Click in the link below to download the new version:");
  console.log(blockBlobClient.url);
}

async function boostrap() {
  console.log("Starting zip files");
  await zipBuildFiles();
  console.log("Starting push to Azure");
  await pushFilesToAzure();
  console.log("Done.");
}

boostrap();
