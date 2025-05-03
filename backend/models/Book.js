const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  id: { type: String, required: true, unique: true },
  volumeInfo: {
    title: String,
    authors: [String],
    publisher: String,
    description: String,
    imageLinks: {
      smallThumbnail: String,
      thumbnail: String
    },
  }
});

module.exports = mongoose.model("Book", bookSchema);
