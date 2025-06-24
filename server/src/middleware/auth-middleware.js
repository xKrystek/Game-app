const jwt = require("jsonwebtoken");
const user = require("../models/User");

const authMiddleware = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Cookie token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, "DEFAULT_SECRET_KEY");
    const userCredentials = user.findById(decoded.getId);

    if (userCredentials) {
      return res.status(200).json({
        success: true,
        userCredentials,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "User not authenticated",
    });
  }
};

module.exports = authMiddleware;
