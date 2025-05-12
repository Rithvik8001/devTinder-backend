const express = require("express");
const { validateSignUpData } = require("./utils/userValidation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { connectDB } = require("./config/database");
const userModel = require("./models/user");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cookieParser());
const userAuth = require("./middlewares/auth");

app.post("/signup", async (req, res) => {
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
    console.log(error);
    res.status(500).send(error.message);
  }
});

app.post("/login", async (req, res) => {
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
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // create a jwt token
      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_SECRET_KEY
      );
      res.cookie("token", token);
      return res.send("User is successfully logged in");
    } else {
      return res.status(401).send("Invalid credentials.");
    }
  } catch (error) {
    console.error(error); // Use console.error for errors
    res.status(500).send("An error occurred during login.");
  }
});

app.get("/profile", userAuth, async (req, res) => {
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

app.post("/sendConncection", async (req, res) => {});

connectDB()
  .then(() => {
    console.log("connection is succesfull");
    app.listen(3000, () => {
      console.log("Server on port 3000 is running successfully");
    });
  })
  .catch((err) => {
    console.log("db connection not succesfull", err);
  });
