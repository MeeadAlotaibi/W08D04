const userModel = require("./../../db/models/user");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
require("dotenv").config();

///////////// signUp /////////////////

const signup = async (req, res) => {
  const { email, password, role } = req.body; // ياخذ من البدي ايميل و باسوورد و رول اللي نوع المستخدم ،، ادمن او يوزر عادي

  const savedEmail = email.toLowerCase(); // يحول الايميل اللي كتبته في البودي الى احرف صغيرة

  const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT)); //يعمل تشفير للبيانات // ويحول سولت الى رقم ، لان اتوقع انها تجي كـ نص ،، مو متاكدة 

  const newUser = new userModel({ // يخزن القيّم المشفرة
    email: savedEmail,
    password: hashedPassword,
    role,
  });

  newUser
    .save() // يحفظهم
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
};


///////////// signin /////////////////


const signin = (req, res) => {
  const { email, password } = req.body; // ياخذ من البدي ايميل و باسوورد 

  const savedEmail = email.toLowerCase(); // يحول الايميل اللي كتبته في البودي الى احرف صغيرة 

  userModel
    .findOne({ email: savedEmail }) // ابحث عن الايميل اللي حولته الى احرف صغيرة
    .then(async (result) => { // النتيجة تحتاج وقت 
      if (result) {// اذا فيه نتيجة ؟
        if (result.email == savedEmail) { // قارن الايميل الي حولته بالايميل الموجود سابقاً
          const checkedPassword = await bcrypt.compare( // هنا كومبير يفك التشفير و يقارن بين الباسوود المشفرة و الباسوورد الاصليه 
            password,
            result.password
          );
          if (checkedPassword) { // اذا نتيجة المقارنة صحيحة
            const payload = { role: result.role, id: result._id };
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
};

///////////////// Get all Users //////////////

const getAllUsers = (req, res) => {
  userModel
    .find({}) // اوجد يجميع اليوزر 
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};
///////////////// Delete User ////////////////////

const deleteUser = (req, res) => {
  const id = req.params.id; // احذف يوزر بالايدي
  console.log(id);
  userModel
    .findByIdAndDelete(id) // ميثود تحذف 
    .then(() => {
      res.status(200).json("user removed");
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};


//////////////// تصدير للفنكشنز ///////////////////////////////

module.exports = { signup, signin, getAllUsers, deleteUser };
