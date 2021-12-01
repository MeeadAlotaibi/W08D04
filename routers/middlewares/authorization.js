const rolerModel = require("./../../db/models/role");

///////////////////// التصريحات /////////////////////////

const authorization = async (req, res, next) => { // تحتاج وقت نحذ اسينك
  try {
    const roleId = req.token.role; // نحزن الرول في متغير 
    const result = await rolerModel.findById(roleId);
    console.log(result.role);
    if (result.role === "admin") { // اذا كان تصريحه يساوي آدمن 
      next(); // اطلع و روح للكونترولر 
    } else {
      return res.status(403).send({ message: "forbidden" }); // اذا غير مصرح له اظهر هذا المسج
    }
  } catch (error) {
    res.status(403).send(error);
  }
};
module.exports = authorization;
