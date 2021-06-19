const express = require("express");
const cors = require("cors");
const app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const client = require("./db-connection");

io.on("connection", function (socket) {
  console.log("A user connected");

  socket.on("disconnect", function () {
    console.log("A user disconnected");
  });

  socket.on("todo_changed", () => {
    client.query("SELECT * from todos").then((result) => {
      const data = result.rows;
      io.emit("todo_changed", { data: data });
    });
  });

  socket.on("user_changed", () => {
    client.query("SELECT * from users").then((result) => {
      const data = result.rows;
      io.emit("user_changed", { data: data });
    });
  });
});

app.use(function (req, res, next) {
  req.io = io;
  next();
});

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

server.listen(3000, function () {
  console.log("server started");
});
