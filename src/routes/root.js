const { Router, application } = require("express");
const router = Router();

// Setting up routes
const memberRouter = require("./member");
const authenticationRouter = require("./authentication");

router.use("/member", memberRouter);
router.use("/authentication", authenticationRouter);

module.exports = router;
