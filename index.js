const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const port = 3001;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
