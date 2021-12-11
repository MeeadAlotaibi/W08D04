const userModel = require("./../../db/models/user");
const postModel = require("./../../db/models/post");
const comModel = require("./../../db/models/comment");
const likeModel = require("./../../db/models/like");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const mailgun = require("mailgun-js");
const DOMAIN = "sandbox093b95b4aa3d4d5abdba1595e7d10442.mailgun.org";
const mg = mailgun({ apiKey: process.env.api_key, domain: DOMAIN });
//////////////////////////// signUp //////////////////////////////

const signup = async (req, res) => {
  const { email, userName, password, avatar, role } = req.body; // ياخذ من البدي ايميل و باسوورد و رول اللي نوع المستخدم ،، ادمن او يوزر عادي

  const savedEmail = email.toLowerCase(); // يحول الايميل اللي كتبته في البودي الى احرف صغيرة
  const savedUseNname = userName.toLowerCase();
  const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT)); //يعمل تشفير للبيانات // ويحول سولت الى رقم ، لان اتوقع انها تجي كـ نص ،، مو متاكدة

  const payload = {
    email: savedEmail,
    userName: savedUseNname,
    password: hashedPassword,
    avatar,
    role,
  };
  const options = { expiresIn: "1h" };
  const token = await jwt.sign(payload, secret, options);
  const data = {
    from: "norelay@myFirstEmail.com",
    to: savedEmail,
    subject: `Hi ${savedUsername}, please verify your account`,
    html: `<h1>Account Verification</h1>
    <a href="${process.env.URL}/auth/${token}">Verify your email address</a>
    `,
  };
  mg.messages().send(data, (error) => {
    if (error) {
      res.status(400).send(error);
    } else {
      res.status(200).send("Email have been sent");
    }
  });

   
}; //Done

///////////////////////// activate user  //////////////////////////////
const activateUser  = (req, res) => {
  const { token } = req.body;
  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        res.status(400).send("Incorrect or expired link");
      } else {
        const { email, username, password } = decodedToken;
        userModel
          .findOne({ email })
          .then((result) => {
            if (result) {
              res.status(400).send("Email is already in use!");
            } else {
              const newUser = new userModel({
                email,
                username,
                password,
                avatar,
                role,
              });
              newUser
                .save()
                .then((result) => {
                  res.status(200).send("Signup successfully");
                })
                .catch((err) => {
                  res.status(400).send(err);
                });
            }
          }).catch((err) => {
            res.status(400).send(err);
          });
      }
    });
  } else {
    res.status(400).send("Somthing went wrong!");
  }
}; //Done

///////////////////////// forget password //////////////////////////////
const forgetPassword = (req, res) => {
  const { email } = req.body;

  const savedEmail = email.toLowerCase();

  userModel
    .findOne({ email: savedEmail })
    .then(async (result) => {
      const payload = {
        _id: result._id,
        email: savedEmail,
      };
      const options = { expiresIn: "1h" };
      const token = await jwt.sign(payload, secret, options);

      const data = {
        from: "norelay@myFirstEmail.com",
        to: savedEmail,
        subject: "Reset Passwoed",
        html: `<h2>Reset Passwoed</h2>
        <a href="${process.env.URL}/reset/${token}">Reset your password</a>
        `,
      };
      userModel
        .findOneAndUpdate({ email: savedEmail }, { resetLink: token })
        .then(() => {
          mg.messages().send(data, (error) => {
            if (error) {
              res.status(400).send(error);
            } else {
              res.status(200).send("Email have been sent");
            }
          });
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}; //Done


///////////////////////// Password Reset Again //////////////////////////////
const newPassword = async (req, res) => {
  const { resetLink, newPass } = req.body;

  const hashedPassword = await bcrypt.hash(newPass, Number(process.env.SALT));

  if (resetLink) {
    jwt.verify(resetLink, secret, (err) => {
      if (err) {
        res.status(401).send("Incorrect or expired link");
      } else {
        userModel
          .findOne({ resetLink })
          .then((result) => {
            if (result) {
              userModel
                .findOneAndUpdate(
                  { resetLink },
                  { password: hashedPassword, resetLink: "" }
                )
                .then(() => {
                  res.status(200).send("Reset successfull");
                })
                .catch((err) => {
                  res.status(400).send(err);
                });
            }
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      }
    });
  } else {
    res.status(401).send("Authentication error");
  }
};

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
/////////////////////////////////////////////////////////////////
const signinWithGoogle = (req, res) => {
  const { token } = req.body;

  clinte
    .verifyIdToken({
      idToken: token,
      audience:
        "303299576143-aiehfsg7l0jrm7313aav0smgh11g150h.apps.googleusercontent.com",
    })
    .then((response) => {
      const { email_verified, email, name, given_name } = response.payload;
      if (email_verified) {
        userModel.findOne({ email }).exec(async (err, user) => {
          if (err) {
            res.status(400).send("Somthing went wrong!");
          } else {
            if (user) {
              const payload = {
                id: user._id,
                role: user.role,
                isDel: user.isDel,
              };
              const options = { expiresIn: "1h" };
              const token = await jwt.sign(payload, secret, options);
              res.status(200).send({ user, token });
            } else {
              let password = email + process.env.secretKey;
              const hashedPassword = await bcrypt.hash(
                password,
                Number(process.env.SALT)
              );
              const newUser = new userModel({
                email,
                username: given_name,
                password: hashedPassword,
              });
              newUser
                .save()
                .then(async (result) => {
                  const payload = {
                    id: result._id,
                    role: result.role,
                    isDel: result.isDel,
                  };
                  const options = { expiresIn: "1h" };
                  const token = await jwt.sign(payload, secret, options);
                  res.status(200).send({ result, token });
                })
                .catch((err) => {
                  // console.log(err);
                  res.status(400).send(err);
                });
            }
          }
        });
      }
    });
};

//////////////// تصدير الفنكشنز ///////////////////////////////

module.exports = { signup, signin, getAllUsers, deleteUser ,activateUser , forgetPassword ,newPassword , signinWithGoogle};

