const mongoose = require("mongoose");

const user = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 20,
  },
  password: { type: String, require: true, minlength: 8, trim: true },
  avatar: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png",
  },
  resetLink: { type: String, default: "" },
  isDel: { type: Boolean, default: false },
  role: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
});

module.exports = mongoose.model("User", user);