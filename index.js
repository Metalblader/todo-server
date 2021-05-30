const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const routerTodo = require("./routers/todo");
const routerUser = require("./routers/user");
const auth = require("./middlewares/auth");

app.get("/", function (req, res) {
  res.send(
    `<html>
      <body>
        <form action="/todo" method="post">
          <input type="text" name="deskripsi" />
          <button>Add</button>
        </form>
      </body>
    </html>`
  );
});

app.use("/todo", auth, routerTodo);
app.use("/user", routerUser);

app.listen(3000, function () {
  console.log("server started");
});
