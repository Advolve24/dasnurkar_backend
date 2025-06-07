// models/Project.js
const mongoose = require("mongoose");

const validTitles = ["RESIDENTIAL", "COMMERCIAL", "INTERIORS", "LANDSCAPE", "EDUCATIONAL", "OTHERS"];
const validScales = ["SMALL", "MEDIUM", "LARGE"];

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    enum: validTitles,
  },
  name: {
    type: String,
    required: true,
  },
  client: {
    type: String,
    required: true,
  },
  scale: {
    type: String,
    enum: validScales,
    required: function () {
      return this.title === "RESIDENTIAL";
    },
    validate: {
      validator: function(value) {
        if (this.title === "RESIDENTIAL") {
          return validScales.includes(value);
        }
        // Allow scale to be undefined or empty for other titles
        return true;
      },
      message: props => `${props.value} is not a valid scale`,
    }
  },
  location: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  mainImage: {
    type: String,
    required: true,
  },
  subImages: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
