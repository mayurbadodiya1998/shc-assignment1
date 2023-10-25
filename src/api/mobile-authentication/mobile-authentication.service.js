var mongoose = require("mongoose");

// prepare schema for mongodb collection
const verificationSchema = new mongoose.Schema({
  phoneNumber: String,
  verificationCode: Number,
  expireInMin: Number,
  otpCreatedTime: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

const VerificationModel = mongoose.model(
  "register_phone_number",
  verificationSchema
);

// create function to insert data in database
insertVerificationCode = async (data) => {
  return VerificationModel.insertMany(data);
};

//create function  to get data by mobile number
getDataByNumber = async (phoneNumber) => {
  return VerificationModel.findOne({ phoneNumber });
};

// create function to update verification code if mobille number already exist
updateVerificationCode = async (phoneNumber, data) => {
  return VerificationModel.updateOne({ phoneNumber }, { $set: data });
};

// create function to get otp details by mobile number  and OTP
getOtpDetails = async (phoneNumber, verificationCode) => {
  return VerificationModel.findOne({ phoneNumber, verificationCode });
};

module.exports = {
  insertVerificationCode,
  getDataByNumber,
  updateVerificationCode,
  getOtpDetails,
};
