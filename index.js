const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const port = 3001;

app.use(cors());
app.use(express.json());

const users = require("./users.json");

// dummy sign up
app.post("/api/signup", (req, res) => {
  if (!req.body.username || !req.body.password) return res.status(400).json("Missing input");
  const existingUser = users.some((user) => user.username === req.body.username);
  if (existingUser) return res.sendStatus(409);
  const newUser = {
    username: req.body.username,
    password: req.body.password,
    todos: [],
  };
  users.push(newUser);
  fs.writeFileSync("users.json", JSON.stringify(users));
  res.status(200).json("Signed up successfully");
});

// authorize and respond data
app.get("/api/todo", (req, res) => {
  const authorization = req.header("Authorization");
  if (!authorization) return res.sendStatus(401);

  const username = authorization.split(":::")[0];
  const password = authorization.split(":::")[1];

  const validUser = users.find((user) => user.username === username && user.password === password);
  if (!validUser) return res.sendStatus(401);
  res.json({ message: validUser.todos });
});

// authorize and append data
app.post("/api/todo", (req, res) => {
  const authorization = req.header("Authorization");
  if (!authorization) return res.sendStatus(401);

  const username = authorization.split(":::")[0];
  const password = authorization.split(":::")[1];

  const validUser = users.find((user) => user.username === username && user.password === password);
  if (!validUser) return res.sendStatus(401);

  const todo = req.body.todo;
  if (!todo) return res.sendStatus(400);
  validUser.todos.push(todo);
  fs.writeFileSync("users.json", JSON.stringify(users));
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
