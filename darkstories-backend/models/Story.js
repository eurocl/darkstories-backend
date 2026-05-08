import mongoose from "mongoose";

const ChapterSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const StorySchema = new mongoose.Schema({
  title: String,
  synopsis: String,
  cover: String,
  userId: String,
  chapters: [ChapterSchema], // 👈 mejor práctica
});

export default mongoose.model("Story", StorySchema);