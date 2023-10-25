const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET; // Replace with your secret key

function verifyToken(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    console.log("error ", error);
    return res.json({ status: 403, message: "Invalid token." });
  }
}

module.exports = verifyToken;
