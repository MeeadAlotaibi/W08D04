const express = require("express");
const {
  addComment,
  showComments,
  getComment,
  editComment,
  deleteComment,
} = require("../controllers/comment");
const authentication = require("./../middlewares/authentication");
const authorization = require("./../middlewares/authorization");
const exist = require("./../middlewares/exist");

const commentRouter = express.Router();

commentRouter.get("/comments", authentication, showComments); //just Admin
commentRouter.get("/getCom/:id", authentication, getComment); //just Admin
commentRouter.post("/addComment/:postId", authentication, exist, addComment);
commentRouter.put("/editComment/:postId/:comId" ,authentication, exist,editComment);
commentRouter.delete("/deleteComment/:postId/:comId",authentication,exist,deleteComment
);

module.exports = commentRouter;
