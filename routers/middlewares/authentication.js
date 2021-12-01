const jwt = require("jsonwebtoken");
require("dotenv").config();

/////////////////////////////////////////////////

const secret = process.env.secretKey; // كلمة السر الموجدة في ملف .env

const authentication = (req, res, next) => {
  try {
          console.log(req);
    if (!req.headers.authorization) /// يتاكد اذا ماعندي توكن أو لا ؟
      return res.status(403).send({ message: "forbidden" });
    const token = req.headers.authorization.split(" ")[1]; //الاوثرايزيشن سترينق .. و عشان اخذ التوكن منه لازم احوله الى ارراي 
    const parsedToken = jwt.verify(token, secret);// اتحقق من كلمة السر و التوكن اللي طلعته من الارراي 
    req.token = parsedToken; // واخزنهم في الركويست و اختار اسم الكي اللي ابغاه 
    next(); // روح للفنكشن اللي بعدها 
  } catch (error) {
    res.status(403).send(error);
  }
};

///////////////////////////////////////////////
module.exports = authentication;
