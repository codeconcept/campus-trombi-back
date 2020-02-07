const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

let users = [];

app.use(express.json());

app.get("/favicon.ico", (req, res) => {
  res.status(204);
});

app.get("/", (req, res) => {
  res.json({ message: "Hello server" });
});

app.post("/register", (req, res) => {
  console.log("body", req.body);
  const encryptedPassword = bcrypt.hashSync(req.body.password, 10);
  const user = { email: req.body.email, password: encryptedPassword };
  users = [...users, user];
  console.log("users", users);
  res.send("todo register");
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
