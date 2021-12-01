const express = require("express");
const {
  signup,
  signin,
  getAllUsers,
  deleteUser,
} = require("../controllers/user");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

//////////////////////////////////////////////////

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);

///////////////////////////////////////////////

userRouter.get("/users", authentication, authorization, getAllUsers);
userRouter.delete("/users/:id", authentication, authorization, deleteUser);

module.exports = userRouter;
