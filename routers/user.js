const express = require("express");
const router = express.Router();
const client = require("../db-connection");
const auth = require("../middlewares/auth");

// client.query(
//   "CREATE TABLE IF NOT EXISTS users (id SERIAL, username VARCHAR(50) NOT NULL, password VARCHAR(50) NOT NULL, PRIMARY KEY (id))"
// );

router.post(
  "/",
  (req, res, next) => {
    client.query("SELECT COUNT(*) as jumlah_user FROM users").then((result) => {
      if (result.rows[0].jumlah_user > 0) {
        auth(req, res, next);
      } else {
        next();
      }
    });
  },
  (req, res, next) => {
    client.query("SELECT * from users").then((result) => {
      const data = result.rows;

      if (data.find((item) => item.username === req.body.username)) {
        res.status(400).send({ error: "INSERT ERROR (username already used)" });
      } else {
        next();
      }
    });
  },
  (req, res) => {
    client.query(
      "INSERT INTO users(username, password) VALUES ($1, $2) RETURNING id",
      [req.body.username, req.body.password],
      (err, result) => {
        if (err) {
          res.end(500);
          return;
        }

        res.json({ id: result.rows[0].id, username: req.body.username });
      }
    );
  }
);

router.get("/", auth, (req, res) => {
  client.query("SELECT * from users").then((result) => {
    const data = result.rows;
    res.json(data);
  });
});

router.delete(
  "/:id",
  auth,
  (req, res, next) => {
    client.query("SELECT COUNT(*) as jumlah_user FROM users").then((result) => {
      if (result.rows[0].jumlah_user > 1) {
        next();
      } else {
        res
          .status(400)
          .send({ error: "DELETE ERROR (only one user remaining)" });
      }
    });
  },
  (req, res) => {
    client.query("DELETE from users WHERE id=($1)", [req.params.id]);
    res.send("NICE");
  }
);

module.exports = router;
