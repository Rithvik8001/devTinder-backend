const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/requests");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

// connect to DB.
connectDB()
  .then(() => {
    console.log("Database Connection is Successful.");
    app.listen(3000, () => {
      console.log("Server on port 3000 is running successfully");
    });
  })
  .catch((err) => {
    console.log("db connection not succesfull", err);
  });
