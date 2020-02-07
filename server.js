const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let users = [];
const secret = "yeah-bad-secret-but-just-for-testing";

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
  const payload = {
    email: user.email,
    iat: Date.now(),
    role: "student"
  };
  res.json({ token: jwt.sign(payload, secret) });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
