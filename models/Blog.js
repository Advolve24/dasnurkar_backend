const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  mainImage: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String, // changed from array of blocks to plain HTML
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);
