const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const passportMongoose = require ("passport-local-mongoose")

const projectSchema = new Schema({
  owner: {type: Schema.Types.ObjectId, ref: 'User'}, // one owner per project
  client: {type: Schema.Types.ObjectId, ref: 'User'}, // one client per project
  projectName: String,
  projectMessage: String,
  imgPath: String,
  // isapproved: Boolean,
  isApproved: {
    type: String,
    enum : ['APPROVED', 'NOT APPROVED'],
    default : 'NOT APPROVED'
  },
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;





