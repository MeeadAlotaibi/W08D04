const express = require("express");
const {
  createNewPost,
  getAllPosts,
  postOfUser,
  deletePost,
  updatePost,
  getPostById,
  likeOfPost,
} = require("./../controllers/post");
const postRouter = express.Router();
const authentication = require("../middlewares/authentication");
const authorization = require("./../middlewares/authorization");
const exist = require("./../middlewares/exist");



//////////////////////////////////////////////

postRouter.post("/newpost", authentication, exist, createNewPost);
postRouter.get("/", authentication, exist, getAllPosts);
postRouter.get("/getposts", authentication, exist, authorization, postOfUser);
postRouter.get("/getpost/:id", authentication, exist, getPostById);
postRouter.put("/updatepost/:id", authentication, exist, updatePost);
postRouter.delete("/deletePost/:id", authentication, exist, deletePost);
postRouter.post("/like/:postId", authentication, likeOfPost);


module.exports = postRouter;
/////// خلصتها 