const express = require("express");
const {
  createNewPost,
  getPosts,
  deletePost,
  // updatePost,
  // getPostById,
} = require("./../controllers/post");
const postRouter = express.Router();
const authentication = require("../middlewares/authentication");


//////////////////////////////////////////////

postRouter.post("/task", authentication, createNewPost);
postRouter.get("/tasks", authentication, getPosts);
postRouter.delete("/task/:id", authentication, deletePost);
// postRouter.put("/task/:id", authentication, updateTask);
// postRouter.get("/task/:id", authentication, getTaskById);


module.exports = postRouter;