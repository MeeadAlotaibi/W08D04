// const taskModel = require("./../../db/models/task");

// /////////////// Create New Task ///////////////////////////

// const createTask = (req, res) => {
//   const newTask = new taskModel({ name: req.body.name, user: req.token.id }); // ما راح يقدر ينشئ تاسك جديد الا اذا كان مسجل دخول و عنده توكن 
//   newTask
//     .save()
//     .then((result) => {
//       res.status(201).json(result);
//     })
//     .catch((err) => {
//       res.status(400).json(err);
//     });
// };

// /////////// Get All the  Tasks That  aren't Deleted /////////

// const getTasks = (req, res) => {
//   taskModel
//     .find({ isDeleted: false, user: req.token.id }) // اوجد جميع التاسكات الغير محذوفه ولااازم تكون مستخدم عنده توكن ،، يعني عامل تسجيل تدخول
//     .then((result) => {
//       res.status(200).json(result); // رجع لي النتيجة
//     })
//     .catch((err) => {
//       res.status(400).json(err);
//     });
// };

// ///////////////// Delete Task ////////////////////////////

// const deleteTask = (req, res) => {
//   const id = req.params.id; // احذف تاسك  بالآيدي عن طريق البرامز 
//   taskModel
//     .findByIdAndUpdate(id, { // فـ اخذنا الآي دي تبع التاسك 
//       $set: {
//         isDeleted: true, // وحولته الى ترو 
//       },
//     })
//     .then((result) => { 
//       if (result) {
//         res.status(200).json("Task is deleted"); // اذا فيه نتيجة اطبع لي
//       } else {
//         res.status(404).json("user does not exist"); // اذا مافيه نتيجة اطبع لي
//       }
//     })
//     .catch((err) => {
//       res.status(400).json(err);
//     });
// };

// ////////////// Update Task ////////////////////////

// const updateTask = (req, res) => {
//     //ناخذ اسم التاسك و ازديليت من البدي 
//   const name = req.body.name;
//   const isDeleted = req.body.isDeleted; //  :) ابغى اسوي ابديت على الديليت ايضا 
//   const id = req.params.id; // ناخذ الايدي تبع التاسك من البرامز
//   taskModel
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
// };
// /////////////// Get Task By Id ///////////////////////

// const getTaskById = (req, res) => {
//   const { id } = req.params; // اجيب كل التاسكات  بالآيدي عن طريق البرامز
//   taskModel
//     .find({ _id: id, user: req.token.id }) //// لاااااااازم تكون مستخدم و عندك توكن يعني مسجل دخول 
//     .then((result) => {
//       if (result) {
//         res.status(200).json(result);
//       } else {
//         res.status(404).json("Task does not exist");
//       }
//     })
//     .catch((err) => {
//       res.status(400).json(err);
//     });
// };

// ////////////تصدير الفنكشنز ///////////
// module.exports = { createTask, getTasks, deleteTask, updateTask, getTaskById };
