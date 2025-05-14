
const express = require('express');
const router = express.Router();
const Book = require("../models/Book");
const verifyToken = require("../middleware/verifyToken");


router.post("/", verifyToken, async (req, res) => {
  const userId = req.userId;
  const { id, volumeInfo } = req.body;
  if (!id || !volumeInfo) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const existing = await Book.findOne({ id });
    if (existing) {
      return res.status(400).json({ message: "Book already exists" });
    }
    const book = new Book({ userId, id, volumeInfo });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.get("/", verifyToken, async (req, res) => {
  const userId = req.userId;
  try {
    const books = await Book.find({ userId }).select("-__v");
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  const userId = req.userId;
  try {
    const result = await Book.findOneAndDelete({ id: req.params.id, userId: userId });
    if (!result) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
