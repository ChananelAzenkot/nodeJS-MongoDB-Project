require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const chalk = require("chalk");
const morgan = require("morgan");
const moment = require("moment");
const fs = require("fs");
const { format } = require("date-fns");

  async function main() {
    await mongoose.connect(process.env.REMOTE_URL);
    console.log(chalk.bgBlue("mongodb connection established on port 27017"));
  }

main().catch(err => console.log(err));

const app = express();

app.use(express.json());

app.use(cors({
    origin: true,
    credentials: true,
    methods: 'GET,PUT,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
}));

app.use((req, res, next) => {
  const fileName = `./logs/log_${moment().format("Y_M_D")}.txt`;
  let responseBody;

  const oldJson = res.json;

  res.json = function(data) {
    responseBody = data;
    oldJson.apply(res, arguments);
  };

//  const oldSend = res.send;

// res.send = function(data) {
//   responseBody = data;
//   oldSend.apply(res, arguments);
// };

// const oldSendFile = res.sendFile;

// res.sendFile = function(path) {
//   responseBody = { file: path };
//   oldSendFile.apply(res, arguments);
// };

  res.on('finish', () => {
    if (res.statusCode >= 400) {
      let content = "";

      content += `Time: ${format(new Date(), "dd-MM-yyyy HH:mm:ss")}\n`;
      content += `Method: ${req.method}\n`;
      content += `Route: ${req.url}\n`;
      content += `Status: ${res.statusCode}\n`;
      content += `Response: ${JSON.stringify(responseBody)}\n`;

      content += "\n";

      fs.appendFile(fileName, content, (err) => {});
    }
  });

  next();
});

app.listen(4000);
app.use(express.static("public"));


morgan.token("time", () => moment().format("YYYY-MM-DD HH:mm:ss"));
const morganFormat = ":time :method :url :status :response-time ms";
app.use(morgan(chalk.bgMagenta(morganFormat)));

require('./handlers/users/login')(app);
require('./handlers/users/signup')(app);
require('./initial-data/initial-data.service');
require('./handlers/cards/cards')(app);
require('./handlers/users/models/users')(app);







