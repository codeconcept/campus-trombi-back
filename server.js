const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var cors = require("cors");

let users = [];
const secret = "yeah-bad-secret-but-just-for-testing";

app.use(cors());
app.use(express.json());

app.get("/favicon.ico", (req, res) => {
  res.status(204);
});

app.get("/", (req, res) => {
  res.json({ message: "Hello server" });
});

app.post("/register", (req, res) => {
  console.log("register / body", req.body);
  const encryptedPassword = bcrypt.hashSync(req.body.password, 10);
  const retrievedEmail = req.body.email.trim();
  const user = {
    email: retrievedEmail,
    password: encryptedPassword,
    name: req.body.name
  };
  // email address must be unique
  const userIndex = users.findIndex(user => user.email === retrievedEmail);
  console.log("userIndex", userIndex);
  if (userIndex !== -1) {
    return res.status(422).json({
      message: `Conflict. User with ${retrievedEmail} already exists`
    });
  }
  users = [...users, user];
  console.log("users", users);
  const payload = {
    email: user.email,
    iat: Date.now(),
    role: "student"
  };
  res.json({
    token: jwt.sign(payload, secret),
    user: { name: req.body.name, email: req.body.email }
  });
});

app.post("/login", (req, res) => {
  console.log("login / body", req.body);
  const retrievedEmail = req.body.email;
  const user = users.find(user => user.email === retrievedEmail);
  if (!user) {
    return res
      .status(401)
      .json({ message: `No user with email ${retrievedEmail}` });
  }
  const password = req.body.password;
  const isMatchPassword = bcrypt.compareSync(password, user.password);
  if (!isMatchPassword) {
    return res.status(401).json({ message: `${password} is a wrong password` });
  }
  const payload = {
    email: user.email,
    iat: Date.now(),
    role: "student"
  };
  res.json({
    token: jwt.sign(payload, secret),
    user: { name: req.body.name, email: req.body.email }
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
