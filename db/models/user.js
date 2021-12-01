const mongoose = require("mongoose");

const user = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  userName: { type: String, required: true, unique: true },
  password: { type: String, require: true },
  avatar: { type: String , default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png", },
  isDel: { type: Boolean, default: false },
  role: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
});

module.exports = mongoose.model("User", user);