const express = require("express");
const requestsRouter = express.Router();
const userAuth = require("../middlewares/authMiddleware");

requestsRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  res.send(`${user.firstName} sent the connection request`);
});

module.exports = {
  requestsRouter,
};
