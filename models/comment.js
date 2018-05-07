const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const passportMongoose = require ("passport-local-mongoose")

const commentSchema = new Schema({
  author: [{type: Schema.Types.ObjectId, ref: 'User'}],
  password: String
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("Comment", commentSchema);




module.exports = Comment;
