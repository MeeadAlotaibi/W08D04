const mongoose = require("mongoose");

const post = new mongoose.Schema({
  
  img: { type: String },
  desc: { type: String, default: false },
  time: { type: Date, default: Date.now },
  isDel: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  like: { type: mongoose.Schema.Types.ObjectId, ref: "Like" },

});

module.exports = mongoose.model("Post", post);
