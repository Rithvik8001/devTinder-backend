const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middlewares/authMiddleware");
const { validateEditProfileData } = require("../utils/userValidation");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.json(user);
  } catch (error) {
    res.status(500).json({
      error: "An internal server error occurred. Please try again later.",
    });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit request");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your profile is updated succesfully.`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).send("Password is required");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let user = req.user;
    user.password = hashedPassword;
    await user.save();
    res.status(200).send("Password updated successfully");
  } catch (error) {
    res.status(500).send("Failed to update password");
  }
});

module.exports = {
  profileRouter,
};
