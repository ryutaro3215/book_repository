const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes');
require('dotenv').config();

const app = express();
const PORT = 3000;

const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err.message));

app.use("/books", bookRoutes);

app.get("/", (_req, res) => res.send("Welcome to the Book API!"));

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
