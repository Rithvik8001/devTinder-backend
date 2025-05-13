const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 25,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      // will only be called when new document is created.
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
    },
    about: {
      type: String,
      default: "Here you can tell about yourself",
    },
    skills: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJwtToken = async function () {
  const user = this;
  const token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" }
  );
  return token;
};

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
