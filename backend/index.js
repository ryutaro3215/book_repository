require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
console.log("JWT_SECRET", JWT_SECRET);

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err.message));

app.use(cookieParser());
app.use("/books", bookRoutes);
app.use("/users", userRoutes);

app.get("/", (_req, res) => res.send("Welcome to the Book API!"));


app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
