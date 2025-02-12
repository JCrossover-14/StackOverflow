// Question Document Schema
const mongoose = require("mongoose");
var Schema = mongoose.Schema;

//define schemas

const questionSchema = new Schema({
  title: { type: String, required: true },
  //set false for now
  summary: { type: String, required: false, maxlength: 140 },
  text: { type: String, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag", required: true }],
  answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
  //set false for now
  asked_by: { type: Schema.Types.ObjectId, ref: "User", required: false },
  ask_date_time: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  votes: { type: Number, default: 0 },
});
//define virtual url
//specific routing for individual question
questionSchema.virtual("url").get(function () {
  return `posts/question/${this._id}`;
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
