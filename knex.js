require("dotenv").config();
// const environment = ;
const knex = require("knex");
const config = require("./knexfile");
const environmentConfig = config["development"];

const connection = knex(environmentConfig);

module.exports = connection;
