const client = require("../db-connection");

module.exports = function (req, res, next) {
  const username = req.headers.username;
  const password = req.headers.password;

  client
    .query("SELECT * from users WHERE username=($1) AND password=($2)", [
      username,
      password,
    ])
    .then((result) => {
      const data = result.rows;
      if (data.length > 0) {
        next();
      } else {
        res.sendStatus(401);
      }
    });
};
