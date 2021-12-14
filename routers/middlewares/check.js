const userModel = require("./../../db/models/user");

const checkinfo = (req, res, next) => {
  const { email, userName, password } = req.body;

  const regexPassword = /^(?=(.*\d){2})(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).{8,}$/;
  const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


  /////////////////////////////////////////////////////// 

  if (regexPassword.test(password) === false) { // يسوي تست على الباسوورد اذا هي مابتحتوي على الرموز هذه 
    res.status(400).send({ message: "Failed password!" }); // يعطي هذه المسج
    return;
  } else if (regexEmail.test(email) === false) {// يسوي تست على الايميل اذا هي مابتحتوي على الرموز هذه 
    res.status(400).send({ message: "Failed Email!" }); // يعطي هذه المسج
    return;
  }
// يشيك ع اسم المستخدم 
  const savedUsername = userName;

  userModel
    .findOne({
      userName: savedUsername, // يشيك ع اسم المستخدم اذا هو نفس المجود مسبقا او لا
    })
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        res.status(400).send({ message: "Username is already in use!" });
        return;
      }

      //يشيك ع الايميل
      const savedEmail = email;
      userModel
        .findOne({
          email: savedEmail, // يشيك ع الايميل اذا هو نفس المجود مسبقا او لا
        })
        .exec((err, user) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          if (user) {
            res.status(400).json({ message: "Email is already in use!" });
            return;
          }

          next();
        });
    });
};

module.exports = checkinfo;
