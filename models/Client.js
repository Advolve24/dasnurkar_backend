const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
    trim: true,
  },
  logo: {
    type: String, // URL or Cloudinary/ImageKit path
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Client", clientSchema);
