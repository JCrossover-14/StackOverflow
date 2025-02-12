const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const answerSchema = new Schema({
  text: { type: String, required: true },
  //set false for now
  ans_by: { type: Schema.Types.ObjectId, ref: "User", required: false },
  ans_date_time: { type: Date, default: Date.now },
  votes: { type: Number, default: 0 },
});

// Virtual routing for specific question
answerSchema.virtual("url").get(function () {
  return `posts/answer/${this._id}`;
});

const Answer = mongoose.model("Answer", answerSchema);

module.exports = Answer;
