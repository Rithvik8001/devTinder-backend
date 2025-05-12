const jwt = require("jsonwebtoken");
require("dotenv").config();
const userModel = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("Token invalid or expired");
    }
    const decodedObj = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { _id } = decodedObj;
    const user = await userModel.findById(_id);
    if (!user) {
      throw new Error("User Not Found.");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send(error.message);
  }
};

module.exports = userAuth;
