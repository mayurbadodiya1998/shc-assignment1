var express = require("express");
var router = express.Router();
var mobileAuthentication = require("../src/api/mobile-authentication/mobile-authentication.controller");

// create route to redirect controller
router.use("/api", mobileAuthentication);

module.exports = router;
