require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for parsing JSON body
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Task Management API',
    status: 'OK',
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
