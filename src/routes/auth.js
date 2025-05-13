const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/userValidation");
const userModel = require("../models/user");
const bcrypt = require("bcrypt");
require("dotenv").config();

// signup Route
authRouter.post("/signup", async (req, res) => {
  const {
    password,
    firstName,
    lastName,
    emailId,
    age,
    gender,
    about,
    skills,
    photoUrl,
  } = req.body;
  try {
    validateSignUpData(req);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({
      firstName: firstName,
      lastName: lastName,
      emailId: emailId,
      password: hashedPassword,
      age: age,
      gender: gender,
      about: about,
      skills: skills,
      photoUrl: photoUrl,
    });
    await user.save();
    res.status(201).send("User successfully created.");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Login route
authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    if (!emailId || !password) {
      return res.status(400).send("Email and password are required.");
    }
    // Find the user by emailId in the database
    const user = await userModel.findOne({ emailId: emailId });
    if (!user) {
      return res.status(404).send("User not found.");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      // JWT Token.
      const token = await user.getJwtToken();
      res.cookie("token", token).json("User is successfully logged in.");
    } else {
      return res.status(401).send("Invalid credentials.");
    }
  } catch (error) {
    res.status(500).send("An error occurred during login.");
  }
});

authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", "", { expires: new Date(Date.now()) })
    .send("Logged Out Succesfull");
});

module.exports = {
  authRouter,
};
