const express = require("express");
const {
  signup,
  signin,
  getAllUsers,
  deleteUser,
  activateUser,
  forgetPassword,
  newPassword,
  signinWithGoogle,
} = require("../controllers/user");


const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");
const check = require("./../middlewares/check");

//////////////////////////////////////////////////

const userRouter = express.Router();

userRouter.get("/users", authentication, authorization, getAllUsers);
userRouter.post("/signup", check, signup);
userRouter.get("/auth/:token", activateUser);
userRouter.put("/forgotPassword", forgetPassword);
userRouter.put("/resetPassword", newPassword);
userRouter.post("/signin", signin);
userRouter.post("/googleSignin", signinWithGoogle );
userRouter.delete("/users/:id", authentication, authorization, deleteUser);

module.exports = userRouter;

///خلصتهم