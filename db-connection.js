const { Client } = require("pg");
const connectionString = "postgres://postgres:postgres@localhost:5432/todo";
const client = new Client({
  connectionString: connectionString,
});
client.connect();

module.exports = client;
