const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
const analyzeRoute = require('./routes/analyze');
app.use('/api', analyzeRoute);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'AI Resume Analyzer API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});