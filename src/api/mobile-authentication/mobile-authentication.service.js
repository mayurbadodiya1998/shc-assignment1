var mongoose = require("mongoose");
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

insertVerificationCode = async (data) => {
  return VerificationModel.insertMany(data);
};

getDataByNumber = async (phoneNumber) => {
  return VerificationModel.findOne({ phoneNumber });
};

updateVerificationCode = async (phoneNumber, data) => {
  return VerificationModel.updateOne({ phoneNumber }, { $set: data });
};

getOtpDetails = async (phoneNumber, verificationCode) => {
  return VerificationModel.findOne({ phoneNumber, verificationCode });
};

module.exports = {
  insertVerificationCode,
  getDataByNumber,
  updateVerificationCode,
  getOtpDetails,
};
