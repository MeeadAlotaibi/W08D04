const userModel = require("./../../db/models/user");
const postModel = require("./../../db/models/post");
const comModel = require("./../../db/models/comment");
const likeModel = require("./../../db/models/like");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
require("dotenv").config();

//////////////////////////// signUp //////////////////////////////

const signup = async (req, res) => {
  const { email, userName, password, avatar, role } = req.body; // ياخذ من البدي ايميل و باسوورد و رول اللي نوع المستخدم ،، ادمن او يوزر عادي

  const savedEmail = email.toLowerCase(); // يحول الايميل اللي كتبته في البودي الى احرف صغيرة
  const savedUseNname = userName.toLowerCase();
  const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT)); //يعمل تشفير للبيانات // ويحول سولت الى رقم ، لان اتوقع انها تجي كـ نص ،، مو متاكدة

  const newUser = new userModel({
    email: savedEmail,
    userName: savedUseNname,
    password: hashedPassword,
    avatar,
    role,
  });

  newUser
    .save()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
}; //Done

///////////////////////// signin //////////////////////////////

const signin = (req, res) => {
  const { email, username, password } = req.body; // ياخذ من البدي ايميل و باسوورد
  const savedEmail = email?.toLowerCase();
  const savedUsername = username?.toLowerCase();


  userModel
    .findOne({
      $or: [{ email: savedEmail }, { userName: savedUsername }],
    })
    .then(async (result) => {
      // النتيجة تحتاج وقت
      if (result) {
        if (result.email == savedEmail || result.userName == savedUsername) {
          const checkedPassword = await bcrypt.compare(
            password,
            result.password
          ); // هنا كومبير يفك التشفير و يقارن بين الباسوود المشفرة و الباسوورد الاصليه
          if (checkedPassword) {
            const payload = {
              role: result.role,
              id: result._id,
              isDel: result.isDel,
            };
            const options = { expiresIn: "60m" }; // اعطي للتوكن عمر افتراضي ٦٠ دقيقة ،، واقدر احط المده اللي ابغاها لكن يفضل ما تكون مده طويلة عشان الحماية
            const secret = process.env.secretKey;
            const token = await jwt.sign(payload, secret, options);
            res.status(200).send({ result, token });
          } else {
            res.status(404).send("Invalid email or password");
          }
        } else {
          res.status(404).send("Invalid email or password");
        }
      } else {
        res.status(404).send("User doesn't exist");
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}; //Done

///////////////// Get all Users are not deleted  //////////////

const getAllUsers = (req, res) => {
  userModel
    .find({ isDel: false }) // اوجد يجميع اليوز الغير محذوف
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
}; //Done
///////////////// Delete User ////////////////////

const deleteUser = (req, res) => {
  const { id } = req.params;

  userModel
    .findOneAndUpdate({ _id: id, isDel: false }, { isDel: true }, { new: true })
    .exec()
    .then((result) => {
      if (result) {
        postModel
          .updateMany({ user: id }, { $set: { isDel: true } })
          .catch((err) => {
            res.status(400).send(err);
          });
        comModel
          .updateMany({ user: id }, { $set: { isDel: true } })
          .catch((err) => {
            res.status(400).send(err);
          });
        likeModel
          .updateMany({ user: id }, { $set: { isLiked: false } })
          .then(() => {
            res.status(201).send("is user is deleted");
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      } else {
        res.status(404).send("Already deleted");
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}; //Done

//////////////// تصدير للفنكشنز ///////////////////////////////

module.exports = { signup, signin, getAllUsers, deleteUser };

