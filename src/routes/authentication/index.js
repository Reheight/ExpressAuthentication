require("dotenv").config();
// This will be more protected than most routes as this will be only for our personal application use meaning we will incoperate CORS
const cors = require("cors");

const { Router } = require("express");
const router = Router();

// Use CORS (Cross-Origin)
router.use(cors({ origin: process.env.RESTRICTED_ORIGIN.split(",") }));

// Importing Routes
const accessRoute = require("./access");

router.use("/access", accessRoute);

module.exports = router;
