const express = require("express");
const {
  createNewPost,
  getPosts,
  deletePost,
  updatePost,
  getPostById,
} = require("./../controllers/post");
const postRouter = express.Router();
const authentication = require("../middlewares/authentication");
const authorization = require("./../middlewares/authorization");



//////////////////////////////////////////////

postRouter.post("/newpost", authentication, createNewPost);
postRouter.get("/getposts", authentication,authorization , getPosts);
postRouter.delete("/deletePost/:id", authentication, deletePost);
postRouter.put("/updatepost/:id", authentication, updatePost);
postRouter.get("/getpost/:id", authentication, getPostById);


module.exports = postRouter;