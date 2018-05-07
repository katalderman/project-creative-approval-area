const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const passportMongoose = require ("passport-local-mongoose")

const projectSchema = new Schema({
  owner: [{type: Schema.Types.ObjectId, ref: 'User'}],
  client: [{type: Schema.Types.ObjectId, ref: 'User'}],
  projectname: String,
  projectmessage: String,
  component: [{
    name: String,
    path: String,
    originalName: String
  }], // array of files
  isapproved: Boolean,
  URL: String,
  password: String
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("Project", projectSchema);

module.exports = Project;
