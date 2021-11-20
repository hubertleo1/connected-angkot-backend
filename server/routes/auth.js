const express = require("express");
const UserDao = require("../data/UserDao");
const { createToken } = require("../util/token");
const { verifyPassword } = require("../util/hashing");

const router = express.Router();
const users = new UserDao();

router.post("/register", async (req, res) => {
  try {
    const { email, password, name, occupation } = req.body;
    const data = await users.create({ email, password,name, occupation });
    res.status(201).json({ data });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

router.post("/authenticate", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "You must provide both email and password.",
    });
  }

  try {
    const user = await users.readOne(email);

    // Authentication!
    const isAuthenticated = await verifyPassword(password, user ? user.password : "");
    if (!isAuthenticated) {
      return res.status(403).json({
        message: "Wrong username or password!",
      });
    } else {
       const token = createToken(user);
      return res.json({
        message: "Authentication successful!",
         token: token,
      });
    }
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
});

module.exports = router;
