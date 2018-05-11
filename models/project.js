const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const passportMongoose = require ("passport-local-mongoose")

const projectSchema = new Schema({
  owner: {type: Schema.Types.ObjectId, ref: 'User'}, // one owner per project
  client: {type: Schema.Types.ObjectId, ref: 'User'}, // one client per project
  projectname: String,
  projectmessage: String,
  component: [{
  name: String,
  imgPath: String, // need to figure out how to store cloudinary path
  originalName: String
  }], // array of files
  isapproved: Boolean,
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;





