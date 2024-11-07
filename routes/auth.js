const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require("bcryptjs");
const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register Route
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body);
  try {
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err); 
    res.status(400).json({ error: err.message || "Error creating user" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const userDetails = { email: user.email, name: user.username, id: user._id }; 
  const token = jwt.sign({userDetails }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

router.post("/google-login", async (req, res) => {
  const { token } = req.body;

  // Verify the token with Google
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { email, name } = ticket.getPayload();

  // Check if the user exists in the database
  let user = await User.findOne({ email });

  if(!user) {
    user = new User({ username: name, email });
    await user.save();
  }

  const userDetails = { email: user.email, name: user.username, id: user._id }; 
  const googleToken = jwt.sign({ userDetails }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token: googleToken });

});

module.exports = router;
