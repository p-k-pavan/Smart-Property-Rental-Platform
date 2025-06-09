// server.js
const express = require('express');
const app = express();
const PORT = 5000;

// Health check route
app.get('/', (req, res) => {
  res.send('✅ Backend is running!');
});

// Optional: API route to test
app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
