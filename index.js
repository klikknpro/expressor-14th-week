const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const port = 3001;

app.use(cors());
app.use(express.json());

const users = require("./users.json");

app.post("/api/signup", (req, res) => {
  if (!req.body.username || !req.body.password) return res.status(400).json("Missing input");
  const existingUser = users.some((user) => user.username === req.body.username);
  if (existingUser) return res.sendStatus(409);
  const newUser = {
    username: req.body.username,
    password: req.body.password,
  };
  users.push(newUser);
  fs.writeFileSync("users.json", JSON.stringify(users));
  res.status(200).json("Signed up successfully");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
