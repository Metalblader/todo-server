const express = require("express");
const router = express.Router();
const client = require("../db-connection");

router.post("/", function (req, res) {
  client.query(
    "INSERT INTO todos(todo) VALUES ($1) RETURNING id",
    [req.body.todo],
    (err, result) => {
      if (err) {
        res.end(500);
        return;
      }

      res.json({ id: result.rows[0].id, todo: req.body.todo });
    }
  );
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
