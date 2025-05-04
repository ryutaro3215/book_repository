const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/verifyToken");

const JWT_SECRETKEY=process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    //check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create new user and save to db
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });
    await user.save();
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRETKEY, {
      expiresIn: "1h",
    });
    //return success response
    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: false,
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    }).status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
})

router.patch("/update", verifyToken, async (req, res) => {
  const userId = req.userId;
  console.log("userId: ", userId);
  const { username, email, password } = req.body;

  if (!username && !email && !password) {
    return res.status(400).json({ message: "No field update" });
  }
  if (email) {
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
  }

  const updateData  = {}
  if (username) updateData.username = username;
  if (email) updateData.email = email;
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updateData.password = hashedPassword;
  }
  try {
    const user = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true, select: "-password" });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const updatedUser = await User.findById(userId).select("-password");
    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}) 

router.get("/", async (_req, res) => {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
})

router.post("/login", async(req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  if (!email || !password) {
    console.log("Missing required fields");
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    //check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Invalid email or password");
      return res.status(400).json({ message: "Invalid email or password" });
    }
    //check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid email or password");
      return res.status(400).json({ message: "Invalid email or password" });
    }
    //create JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRETKEY, {
      expiresIn: "1h",
    })
    //return success response with token
    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: false,
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    }).status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
})

router.get("/me", async (req, res) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRETKEY);
    const user = await User.findById(decoded.id).select("-password");
    res.status(200).json({ user });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
})

router.post("/logout", async (_req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logged out successfully" });
})



module.exports = router;
