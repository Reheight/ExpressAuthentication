require("dotenv").config();
const ProtectedRoute = require("./middleware/ProtectedRoute");

// We will import Express since this is what we will be using for our server.
const express = require("express");

// We will import body-parser
const bodyparser = require("body-parser");

// Import CORS
const cors = require("cors");

// Import Router Root
const root = require("./routes/root");

// Create Express object
const app = express();

// Use Middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", root);

app.listen(process.env.PORT, () => {
  console.log(`⚡️ [server]: Server is running on port ${process.env.PORT}`);
});
