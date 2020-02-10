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
  const now = Date.now();
  const user = {
    id: now,
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
    iat: now,
    role: "student"
  };
  res.json({
    token: jwt.sign(payload, secret),
    user: { id: now, name: req.body.name, email: req.body.email }
  });
});

app.post("/login", (req, res) => {
  console.log("POST login / body", req.body);
  const retrievedEmail = req.body.email;
  const user = users.find(user => user.email === retrievedEmail);
  console.log("user found", user);
  if (!user) {
    return res
      .status(401)
      .json({ message: `No user with email ${retrievedEmail}` });
  }
  const password = req.body.password;
  console.log("password, user.password", password, user.password);
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
    user: {
      name: user.name,
      class: user.class,
      classValue: user.classValue,
      cellPhone: user.cellPhone,
      pictureUrl: user.pictureUrl,
      internshipAt: user.internshipAt,
      inCampus: user.inCampus,
      id: user.id,
      email: user.email
    }
  });
});

app.get("/users", (req, res) => {
  const usersWithoutPassword = users.map(user => {
    return { ...user, password: "" };
  });
  res.json({
    users: usersWithoutPassword,
    nbUsers: usersWithoutPassword.length
  });
});

app.post("/users/:id", (req, res) => {
  console.log(`POST user with id of ${req.params.id}`);
  const id = +req.params.id;
  users = users.map(user => (user.id === id ? req.body : user));
  console.log("users after POST", users);
});

//we add this PUT because will real DB, we would handle a PUT
app.put("/users/:id", (req, res) => {
  console.log(`PUT user with id of ${req.params.id}`);
  const id = +req.params.id;
  console.log("id", id);
  const user = users.find(user => user.id === id);
  console.log("user found", user);
  const updatedUser = Object.assign(user, req.body);
  users = users.map(user => (user.id === id ? updatedUser : user));
  console.log("users after PUT", users);
  res.json({ message: `user ${id} updated` });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
