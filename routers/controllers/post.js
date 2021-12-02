const postModel = require("./../../db/models/post");

/////////////// Create New Post ///////////////////////////

const createNewPost = (req, res) => {
  const { img, desc } = req.body;
  const newPost = new postModel({ img, desc, user: req.token.id });
  newPost
    .save()
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}; // Done

/////////////// Get All the  Posts  ////////////////////////

const getAllPosts = (req, res) => {
  postModel
    .find({ isDel: false })
    .then((result) => {
      if (result.length > 0) {
        res.status(201).send(result);
      } else {
        res.status(404).send("There is no posts");
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}; //Done

////////////////// show user post/////////////////////////

const postOfUser = (req, res) => {
  postModel
    .find({})
    .exec()
    .then((result) => {
      if (result.length > 0) {
        res.status(201).send(result);
      } else {
        res.status(404).send("the user has no posts");
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};
/////////////// Get Post By Id ///////////////////////

const getPostById = (req, res) => {
  const { id } = req.params;
  postModel
    .findById(id)
    .exec()
    .then((result) => {
      if (result) {
        res.status(201).send(result);
      } else {
        res.status(404).send("post is not exist");
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}; /// خلصتها 

///////////// Update Task ////////////////////////

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { img, desc } = req.body;

  postModel
    .findOneAndUpdate(
      { _id: id, user: req.token.id },
      { img, desc },
      { new: true }
    )
    .exec()
    .then((result) => {
      if (result) {
        res.status(201).send("Post is updated");
      } else {
        res.status(404).send("Post does not exist");
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}; // خلصتها

///////////////// Delete Post ////////////////////////////

const deletePost = async (req, res) => {
  const { id } = req.params;

  postModel
    .findOneAndUpdate(
      { _id: id, user: req.token.id, isDel: false },
      { isDel: true },
      { new: true }
    )
    .exec()
    .then((result) => {
      if (result) {
        res.status(201).send("post is deleted");
      } else {
        res.status(404).send("Post does not exist");
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });


};  // خلصتها


/////////////////// Like for Post  //////////////////////

const likeOfPost = (req, res) => {
  const postId = req.params.postId;

   likeModel
    .findOne({ post: postId, user: req.token.id })
    .then((ruselt) => {
      if (ruselt) {
        likeModel
          .findOneAndUpdate(
            { post: postId, user: req.token.id },
            { isLiked: !ruselt.isLiked  }
          ).then((updateResult) => {
            res.status(201).send(updateResult);
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      } else {
        const likePost = new likeModel({
          post: postId,
          user: req.token.id,
        });

        likePost
          .save()
          .then((newResult) => {
            res.status(201).send(newResult);
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};/// خلصتها 


////////////تصدير الفنكشنز ///////////
module.exports = {
  createNewPost,
  getAllPosts,
  postOfUser,
  deletePost,
  updatePost,
  getPostById,
  likeOfPost,
};
