const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const passportMongoose = require ("passport-local-mongoose")

const projectSchema = new Schema({
  owner: {type: Schema.Types.ObjectId, ref: 'User'},
  client: {type: Schema.Types.ObjectId, ref: 'User'},
  projectname: String,
  projectmessage: String,
  isapproved: Boolean,
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;




  // component: [{
  //   name: String,
  //   imgPath: String,
  //   originalName: String
  // }], // array of files
