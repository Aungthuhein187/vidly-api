const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

exports.genreSchema = genreSchema;
exports.Genre = Genre;
