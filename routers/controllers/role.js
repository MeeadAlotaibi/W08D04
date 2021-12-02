const rolerModel = require("./../../db/models/role");

////  هنا ننشئ تصنيفات اليوزر  إما بيكون ادمن او مستخدم عادي و اعطيه الصلاحيات الخاصة فيه
const create = (req, res) => {
  const { role, permission } = req.body; // اخذ نوع المستخدم و صلاحياته من البودي  
  const newRole = new rolerModel({
    role, //// النوع 
    permission, /// الصلاحيات 
  });
  console.log(newRole)

  newRole // المتغير اللي خزن فيه القيم الجديدة
    .save() // نحفظ
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      console.log(err)
      res.status(400).send(err);
    });
};
///////////////////////////////////////////////

const roles = (req, res) => {
  rolerModel
    .find({}) 
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
};
///////////////////////////////////////////////
module.exports = { create, roles };


// خلصتهم