const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middlewares/authMiddleware");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.json(user);
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    res.status(500).json({
      error: "An internal server error occurred. Please try again later.",
    });
  }
});

module.exports = {
  profileRouter,
};
