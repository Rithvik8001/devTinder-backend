const express = require("express");
const { validateSignUpData } = require("./utils/userValidation");
const bcrypt = require("bcrypt");

const { connectDB } = require("./config/database");
const userModel = require("./models/user");

// creating an express instance
const app = express();

app.use(express.json());

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
      return res.send("User is successfully logged in");
    } else {
      return res.status(401).send("Invalid credentials.");
    }
  } catch (error) {
    console.error(error); // Use console.error for errors
    res.status(500).send("An error occurred during login.");
  }
});

app.get("/profile", async (req, res) => {
  const email = req.query.emailId;
  if (!email) {
    return res.status(400).send("Email ID is required.");
  }
  try {
    const user = await userModel.findOne({
      emailId: email,
    });
    if (!user) {
      return res.status(404).send("User not found.");
    }
    const userDetails = {
      firstName: user.firstName,
      lastName: user.lastName,
      emailId: user.emailId,
      age: user.age,
      gender: user.gender,
      photoUrl: user.photoUrl,
      about: user.about,
      skills: user.skills,
    };
    res.send(userDetails);
  } catch (error) {
    res.status(500).send("An error occurred while fetching the profile.");
  }
});

// update the data of the user
app.patch("/updateProfile", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;

  const allowUpdates = ["skills", "firstName", "lastName", "about", "userId"];
  const noOfSkillsAllowed = 15;

  const isAllowedUpdates = Object.keys(data).every((key) => {
    return allowUpdates.includes(key);
  });
  // If the update is not allowed, send the response and do not proceed.
  if (!isAllowedUpdates) {
    return res.status(401).send("Cannot update the field");
  }

  if (data.skills && data.skills.length > noOfSkillsAllowed) {
    return res.status(401).send("Too many skills, keep it under 15.");
  }

  if (data.about == "") {
    return res.send("no about");
  }

  try {
    const updateUser = await userModel.findByIdAndUpdate(userId, data, {
      // returns the updated document
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User profile is successfully updated");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// delete the data of the profile
app.delete("/profile", async (req, res) => {
  const userId = req.query.userId;
  try {
    const user = await userModel.findByIdAndDelete(userId);
    res.send("User deleted succesfully");
  } catch (error) {
    res.status(401).send("Error saving the user");
  }
});

// feed api - get all users from db
app.get("/feed", async (req, res) => {
  try {
    // if passed an empty filter will return all the docuemnts in that collection.
    const users = await userModel.find({});
    res.send(users);
  } catch (error) {
    console.log(error);
  }
});

// listen to the incoming requests.
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
