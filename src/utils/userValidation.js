const validator = require("validator");

const validateSignUpData = (req) => {
  const {
    firstName,
    lastName,
    emailId,
    password,
    age,
    gender,
    photoUrl,
    about,
    skills,
  } = req.body;

  if (
    !firstName ||
    typeof firstName !== "string" ||
    firstName.length < 4 ||
    firstName.length > 25
  ) {
    throw new Error(
      "First name is required and must be between 4 to 25 characters."
    );
  }
  if (lastName && typeof lastName !== "string") {
    throw new Error("Last name must be a string.");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email address.");
  }
  if (!password || password.length < 8) {
    throw new Error("Password is required and must be at least 8 characters.");
  }
  if (age && (typeof age !== "number" || age <= 0)) {
    throw new Error("Age must be a positive number.");
  }
  if (!["male", "female", "others"].includes(gender)) {
    throw new Error("Gender must be one of 'male', 'female', or 'others'.");
  }
  if (validator.isURL(photoUrl)) {
    throw new Error("Photo URL must be a valid string.");
  }
  if (about && typeof about !== "string") {
    throw new Error("About must be a valid string.");
  }
  if (
    !skills ||
    !Array.isArray(skills) ||
    skills.some((skill) => typeof skill !== "string")
  ) {
    throw new Error("Skills should only consists alphabets.");
  }
};

module.exports = {
  validateSignUpData,
};
