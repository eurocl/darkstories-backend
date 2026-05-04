const mongoose = require("mongoose");

const ChapterSchema = new mongoose.Schema({
  title: String,
  content: String
});

const StorySchema = new mongoose.Schema({
  title: String,
  synopsis: String,   // 👈 NUEVO
  cover: String,      // 👈 NUEVO (URL de imagen)
  userId: String,
  chapters: [
    {
      title: String,
      content: String,
    },
  ],
});

module.exports = mongoose.model("Story", StorySchema);