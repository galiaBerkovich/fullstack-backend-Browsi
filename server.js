const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Routes
const publisherRoutes = require('./routes/publishers');
app.use('/api/publishers', publisherRoutes);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
