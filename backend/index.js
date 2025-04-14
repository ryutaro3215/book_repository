const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
const DATA_PATH = path.join(__dirname, "data", "data.json");

app.use(cors());
app.use(bodyParser.json());

if (!fs.existsSync(DATA_PATH)) {
  fs.writeFileSync(DATA_PATH, JSON.stringify([]));
}

app.post('/books', (req, res) => {
  try {
    const newBook = req.body;
    const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    if (!Array.isArray(data)) data = [];

    console.log('Received new book:', newBook);

    if (data.some(book => book.id=== newBook.id)) {
      return res.status(400).send('Book with this ID already exists');
    }

    data.push(newBook);
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    res.status(201).send('Book added successfully');
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).send('Internal Server Error');
  }
})

app.delete('/books/:id', (req, res) => {
  try {
    const bookId = req.params.id;
    let data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    if (!Array.isArray(data)) data = [];

    const bookIndex = data.findIndex(book => book.id === bookId);
    if (bookIndex === -1) {
      return res.status(404).send('Book not found');
    }
    data.splice(bookIndex, 1);
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    res.status(200).send('Book deleted successfully');
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/books', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    if (!Array.isArray(data)) data = [];
    res.status(200).json(data);
  } catch (e) {
    console.error('Error fetching books:', e);
    res.status(500).send('Internal Server Error');
  }
})

app.get('/', (req, res) => {
  res.send('Welcome to the Book API');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})
