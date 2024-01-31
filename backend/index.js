require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const chalk = require("chalk");


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

app.listen(4000);

app.get('/', (req, res) => res.send("Hello World!"));
require('./handlers/users/login')(app);
require('./handlers/users/signup')(app);
require('./initial-data/initial-data.service');
require('./handlers/cards/cards')(app);
require('./handlers/users/models/users')(app);