const express = require("express");
const router = express.Router();
const client = require("../db-connection");

router.post("/", function (req, res) {
  // console.log(req.body.deskripsi);
  client.query("INSERT INTO todos(todo) VALUES ($1)", [req.body.todo]);
  res.end();
});

router.get("/", function (req, res) {
  client.query("SELECT * from todos").then((result) => {
    // const todos = result.rows.map((todo) => `<div>${todo.todo}</div>`);
    // const data = todos.join("");
    const data = result.rows;
    // todos.forEach((todo) => {
    //   res.send(todo);
    // });
    res.json(data);
  });
});

router.delete("/:id", function (req, res) {
  client.query("DELETE from todos WHERE id=($1)", [req.params.id]);
  res.end();
});

module.exports = router;
