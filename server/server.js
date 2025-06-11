const express = require('express');
const app = express();
const PORT = 5000;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();
const authRoutes = require("./routes/auth.routes");
const propertyRoutes = require("./routes/property.routes");
const userRoutes = require("./routes/user.routes");

mongoose
  .connect(process.env.MONGODB, { serverSelectionTimeoutMS: 30000 })
  .then(() => console.log("Connected to DB"))
  .catch((error) => {
    console.error("Error connecting to DB:", error.message);
    if (error.message.includes('timed out')) {
      console.error('Connection attempt timed out. Check DB server and network settings.');
    } else {
      console.error('Unexpected error:', error);
    }
  });

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/properties",propertyRoutes)
app.use("/api/user",userRoutes)

app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
