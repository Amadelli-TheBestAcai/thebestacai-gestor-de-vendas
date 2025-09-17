const zipFolder = require("zip-folder");
const FormData = require("form-data");

const fs = require("fs");
const axios = require("axios");
const moment = require("moment");

const pkg = require("./package.json");
const env = require("./electron/src/providers/env.json");

const buildName = `gestor-v1-${env.ENV}-${moment(new Date())
  .subtract(3, "hours")
  .format("DD-MM-YYYYTHH-mm")}-v${pkg.version}.zip`;

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
  const formData = new FormData();

  const filePath = `./${buildName}`;

  formData.append("file", fs.createReadStream(filePath), {
    filename: buildName,
  });
  formData.append("owner", "ti");
  formData.append("folder", "gestor-de-vendas");
  formData.append("action", "create");

  await axios({
    method: "POST",
    url: `${env.API_AUTH}/files-management`,
    data: formData,
    headers: {
      Authorization: `Bearer ${env.API_TOKEN}`,
      ...formData.getHeaders(),
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });
}

async function boostrap() {
  console.log("Starting zip files");
  await zipBuildFiles();
  console.log("Starting push to Azure");
  await pushFilesToAzure();
  console.log("Done.");
}

boostrap();
