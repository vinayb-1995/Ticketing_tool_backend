require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express(); // Fixed declaration

/* CORS setup to handle requests from frontend (running on port 3000) to backend (running on port 6000) */
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
  credentials: true,
};
app.use(cors(corsOptions));

// Require mongoose connection
const connectDb = require("./utils/db");

// Require router
const adminRouter = require("./Router/adminRouter");

// Middleware to parse JSON
app.use(express.json());

// Use the admin router
app.use("/api/register", adminRouter);

// Define port
const PORT = 5000;

// Connect to the database and start the server
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started successfully on port ${PORT}`); // Fixed typo
  });
}).catch((error) => {
  console.error("Database connection failed", error);
});
