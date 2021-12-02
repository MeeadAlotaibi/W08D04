const postModel = require("./../../db/models/post");
const commentModel = require("./../../db/models/comment");

///////////////// add comment //////////////////

const addComment = (req, res) => {
  const postId = req.params.postId ;
  const comment = req.body.comment ;
  postModel
    .findOne({ postId, isDel: false })
    .then((result) => {
      if (result) {
        const newCom = new comModel({
          comment,
          user: req.token.id,
          post: postId,
        });
        newCom
          .save()
          .then(() => {
            res.status(201).send("Comment posted successfully");
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      } else {
        res.status(404).send("Failed");
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

//Show all comments just for Admin
const showComments = (req, res) => {
  commentModel
    .find({ isDel: false })
    .then((result) => {
      if (result.length > 0) {
        res.status(201).send(result);
      } else {
        res.status(404).send("No posts");
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

// show post by id
const getComment = (req, res) => {
  const { id } = req.params;
  commentModel
    .findById(id)
    .exec()
    .then((result) => {
      if (result) {
        res.status(201).send(result);
      } else {
        res.status(404).send("Comment is not exist");
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

////////////// Update on comment /////////////////

const editComment = (req, res) => {
  const { postId, comId } = req.params;
  const { comment } = req.body;

  commentModel
    .findOneAndUpdate(
      { _id: comId, user: req.token.id, post: postId },
      { comment },
      { new: true }
    )
    .exec()
    .then((result) => {
      console.log(result);
      if (result) {
        res.status(201).send("comment is updated");
      } else {
        res.status(404).send("Failed update");
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

// Delete comment
const deleteComment = (req, res) => {
  const { postId, commentId } = req.params;

  commentModel
    .findOneAndUpdate(
      { _id: commentId, user: req.token.id, post: postId, isDel: false },
      { isDel: true },
      { new: true }
    )
    .exec()
    .then((result) => {
      if (result) {
        res.status(201).send("Comment is Deleted ");
      } else {
        res.status(404).send("Failed deleted⚠️");
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

module.exports = {
  addComment,
  showComments,
  getComment,
  editComment,
  deleteComment,
};
