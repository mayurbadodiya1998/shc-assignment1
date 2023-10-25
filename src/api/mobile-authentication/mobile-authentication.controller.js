var express = require("express");
var app = express.Router();
var service = require("./../mobile-authentication/mobile-authentication.service");
var jwt = require("jsonwebtoken");
const twilio = require("twilio");
const verifyToken = require("../../app/middelware/auth-token");

// Post api for send otp on mobile number
app.post("/send-otp", verifyToken, async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  let isCodeSent = false;
  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  const prepareData = {
    phoneNumber,
    verificationCode,
    createdAt: new Date(),
  };
  const isPhoneNumberExistCursor = await service.getDataByNumber(phoneNumber);
  // Send the verification code via SMS with tiwlio
  const client = new twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  client.messages
    .create({
      to: phoneNumber,
      from: "+1 910 728 4820",
      body: `Your verification code: ${verificationCode}. Verification code will expire in ${process.env.OTP_EXPIRY_TIME_IN_MINUTE} Min`,
    })
    .then(async (message) => {
      if (isPhoneNumberExistCursor) {
        const currentTime = new Date();

        // if mobile number exist in collection so update  OTP and OTP time
        const updateVerificationCode = await service.updateVerificationCode(
          phoneNumber,
          { verificationCode, otpCreatedTime: currentTime }
        );

        isCodeSent = true;
      } else {
        // If mobile number not exist in collection so add mobile number and OTP
        const insertVerificationCode = await service.insertVerificationCode(
          prepareData
        );
        isCodeSent = true;
      }
      if (isCodeSent) {
        res.json({
          status: 200,
          message: "Otp sent.",
        });
      }
    })
    .catch((error) => {
      console.error(`Error sending SMS: ${error}`);
      res.json({ status: 400, message: `${error}` });
    });
  // -----------------------------------------------------------------------
});

// Post API for verifing otp with expiry time
app.post("/verify-code", verifyToken, async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const userEnteredCode = req.body.code;
  const otpDetails = await service.getOtpDetails(phoneNumber, userEnteredCode);
  if (otpDetails) {
    const now = new Date();
    const twoMinutesAgo = new Date(
      now - process.env.OTP_EXPIRY_TIME_IN_MINUTE * 60 * 1000
    );

    // condition to check expiry time
    if (otpDetails.otpCreatedTime > twoMinutesAgo) {
      res.json({ status: 200, message: "Valid OTP" });
    } else {
      res.json({ status: 400, message: "OTP has expired" });
    }
  } else {
    res.json({
      status: 400,
      message: "OTP Verified Successfully",
    });
  }
});

// Get Api for create dummmy jwt token
app.get("/create-token", (req, res) => {
  let token = jwt.sign({ id: 101 }, process.env.JWT_SECRET);
  res.json({
    status: 400,
    data: token,
    message: "Token Created",
  });
});

module.exports = app;
