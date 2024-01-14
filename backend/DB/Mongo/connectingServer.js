const mongoose = require("mongoose");
const chalk = require("chalk");

const remoteURL = process.env.REMOTE_URL;

mongoose
  .connect(remoteURL)
  .then(() =>
    console.log(chalk.magentaBright("connected to MongoDb Remotely!"))
  )
  .catch((error) =>
    console.log(chalk.redBright.bold(`could not connect to mongoDb: ${error}`))
  );
