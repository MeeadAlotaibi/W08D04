const postModel = require("./../../db/models/post");

/////////////// Create New Post ///////////////////////////

const createNewPost = (req, res) => {
  const newPost = new postModel({ img ,description , isDel , user: req.token.id }); // ما راح يقدر ينشئ تاسك جديد الا اذا كان مسجل دخول و عنده توكن 
  newPost
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
}; // Done

/////////////// Get All the  Posts  ////////////////////////

const getPosts = (req, res) => {
  postModel
  .find({}) //اووجد الجميييع 
    .then((result) => {
      if (result) { // اذا كان فيه نتيجة ؟
        res.status(200).json(result); // رجعها لي 
      } else {
        res.status(404).json("There is no posts");
     }   
 }).catch((err) => {
      res.status(400).json(err);
    });
}; //Done

///////////////// Delete Post ////////////////////////////

const deletePost = async (req, res) => {
  const id = req.params.id; // احذف تاسك  بالآيدي عن طريق البرامز
  let user = false;

  await postModel
    .findOne({ _id: id, user: req.token.id }) 
    .then((result) => {
      if (result) {
        user = true;   
      }
    }); 
      const result = await postModel.findById(req.token.role);
      if (result.role == "admin" || user) { //هنا نشيّك اذا اليوزر ادمن او لا 
        postModel
          .findByIdAndUpdate(id, { $set: { isDel : true } })
          .then((result) => {
            if (result) {
              res.status(200).json("post removed");
            } else {
              res.status(404).json("post does not exist");
            }
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      } else {
        res.json("you don't have the Authorization to delete the post");
      }

};  // Done

////////////// Update Task ////////////////////////

// const updatePost = (req, res) => {
//     //ناخذ اسم التاسك و ازديليت من البدي 
//   const name = req.body.name;
//   const isDeleted = req.body.isDeleted; //  :) ابغى اسوي ابديت على الديليت ايضا 
//   const id = req.params.id; // ناخذ الايدي تبع التاسك من البرامز
//   postModel
//     .findByIdAndUpdate(id, {
//       $set: {
//         name: name, //  غير لي على اسم التاسك بالاسم اللي حطيته في البدي //
//         isDeleted: isDeleted, //  غير لي على حالة الازديليت بالحاله  اللي حطيتها له في البدي //
//       },
//     })
//     .then((result) => {
//       if (result) { // يشيك على النتيجة 
//         res.status(200).json("Task is updated"); //اذا فيه نتيجة اظهر هذا المسج 
//       } else {
//         res.status(404).json("Task has not been found");// اذا مافيه
//       }
//     })
//     .catch((err) => {
//       res.status(400).json(err);
//     });
// }; // I'm Not Finish Yet :(


/////////////// Get Post By Id ///////////////////////

const getPostById = (req, res) => {
  const { id } = req.params; // اجيب كل التاسكات  بالآيدي عن طريق البرامز
  postModel
    .find({ _id: id }) 
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json("Post does not exist");
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
}; /// Done 

////////////تصدير الفنكشنز ///////////
module.exports = {
  createNewPost,
  getPosts,
  deletePost,
  // updatePost,
  getPostById,
};
