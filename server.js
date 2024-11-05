require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express(); // Fixed declaration
const { v4: uuidv4 } = require('uuid'); // Import uuid

/* CORS setup to handle requests from frontend (running on port 3000) to backend (running on port 6000) */
const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
  credentials: true,
};
app.use(cors(corsOptions));

// Require mongoose connection
const connectDb = require("./utils/db");

/* -----------------------------------generate unique id for tickets ------------------ */
app.get('/generate-uuid', (req, res) => {
  let uniqueId = uuidv4(); // Generate a UUID
  uniqueId = uniqueId.replace(/-/g, ''); // Remove dashes from UUID
  uniqueId = uniqueId.substring(0, 20);
  res.json({ uuid: uniqueId }); // Send UUID as response
});
/* -----------------------------------generate unique id for tickets ------------------ */
/* -----------------------------------router required------------------ */
// Require admin router
const adminRouter = require("./Router/adminRouter");

// Require customer router
const customerRouter = require("./Router/customerRouter");

// Require customer router
const agentRouter = require("./Router/agentRouter");

// Require ticket router
const ticketRouter = require("./Router/ticketRoutes");
/* -----------------------------------router required------------------ */

// Middleware to parse JSON
app.use(express.json());

/*-----------------------------------routere apis----------------------*/
// Use the admin router
app.use("/api/admin", adminRouter);

// Use the customer router
app.use("/api/customer", customerRouter);

// Use the customer router
app.use("/api/agent", agentRouter);

// Use the ticket router
app.use("/api/tickets", ticketRouter);
/*-----------------------------------routere apis----------------------*/

// Define port
const PORT = 5000;

// Connect to the database and start the server
connectDb()
  .then(() => {
    app.listen(PORT,"0.0.0.0", () => {
      console.log(`Server started successfully on port ${PORT}`); // Fixed typo
    });
  })
  .catch((error) => {
    console.error("Database connection failed", error);
  });
