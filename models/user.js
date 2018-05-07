const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const passportMongoose = require ("passport-local-mongoose")

const userSchema = new Schema({
  role: {
    type: String,
    enum : ['CLIENT', 'ADMIN'],
    default : 'CLIENT'
  },
  email: String,
  password: String,
  firstname: String,
  lastname: String,
  projectsApproved: [{type: Schema.Types.ObjectId, ref: 'Projects'}],
  projectsPending: [{type: Schema.Types.ObjectId, ref: 'Projects'}]
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

// userSchema.plugin(passportMongoose, {emailField: "email"})
const User = mongoose.model("User", userSchema);

module.exports = User;