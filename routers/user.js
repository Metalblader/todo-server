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
        // console.log("NEXT");
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
        console.log("TESTING", result.rows[0].jumlah_user);
        next();
      } else {
        res.send("DELETE ERROR");
      }
    });
  },
  (req, res) => {
    client.query("DELETE from users WHERE id=($1)", [req.params.id]);
    res.send("NICE");
  }
);

module.exports = router;
