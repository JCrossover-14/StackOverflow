// Tag Document Schema

const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const tagSchema = new Schema({
  name: { type: String, required: true },
});

//virtual routing
tagSchema.virtual("url").get(function () {
  return `posts/tag/${this._id}`;
});

const Tag = mongoose.model("Tag", tagSchema);

module.exports = Tag;

