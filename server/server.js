// server.js
const express = require('express');
const app = express();
const PORT = 5000;
const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config();


mongoose
  .connect(process.env.MONGODB, { serverSelectionTimeoutMS: 30000 })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((error) => {
    console.error("Error connecting to DB:", error.message);

    if (error.message.includes('timed out')) {
      console.error('Connection attempt timed out. Please check your database server and network settings.');
    } else {
      console.error('An unexpected error occurred:', error);
    }
  });

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
