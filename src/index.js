var express = require("express");
var router = express.Router();
var mobileAuthentication = require("../src/api/mobile-authentication/mobile-authentication.controller");

/* GET home page. */
router.use("/api", mobileAuthentication);

module.exports = router;
