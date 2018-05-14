const express     = require('express');
const router      = express.Router();
const multer      = require('multer');
const cloudinary  = require('cloudinary');
const storage     = require('multer-storage-cloudinary');
const uploadCloud = require("../config/cloudinary")
const bodyParser   = require('body-parser'); //cleans our req.body
const cookieParser = require('cookie-parser');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const Project      = require("../models/project");
const User         = require("../models/user");
const session      = require("express-session");
const bcrypt       = require("bcrypt");
const passport     = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash        = require("connect-flash");
const ensureLogin  = require("connect-ensure-login");


// PROJECT CREATE GET
router.get("/projectcreate", ensureLogin.ensureLoggedIn(), (req, res) => {
  // console.log("the user is: ", req.user)
  if(req.user.role === 'ADMIN'){

    User.find({})
  .then( user => {

    res.render("projectcreate", { user });
  }) } else {
    res.send("Sorry!")
  }
});




// PROJECT CREATE POST
router.post("/projectcreate", uploadCloud.single('photo'), function(req,res) {
    Project.create({
      owner: req.body.theOwner,
      client: req.body.theClient,
      projectName: req.body.theProjectName,
      projectMessage: req.body.theProjectMessage,
      imgPath: req.file.url
    })
    .then ((theUser) => {
  res.redirect('/')
})
});


  //   const newProject = new Project ({
  //     owner: req.body.theOwner,
  //     client: req.body.theClient,
  //     projectname: req.body.theProjectname,
  //     projectmessage: req.body.theProjectmessage
  //     // need to store component (project images) but not sure how
  //   });
  //   newProject.save((err) => {
  //     if (err) {
  //       res.render("projectcreate", { message: "Something went wrong" });
  //     } else {
  //       // req.session.currentUser = user;
  //       res.redirect("/dashboardAdmin");
  //   }
  //   });
  // });






// // createuser POST
// router.post("/createuser", (req, res, next) => {
//   const email = req.body.email;
//   const password = req.body.password;
//   const firstname = req.body.firstname;
//   const lastname = req.body.lastname;
//   const role = req.body.role;

//   if (email === "" || password === "") {
//     res.render("passport/createuser", { message: "Indicate email and password" });
//     return;
//   }

//   User.findOne({ email }, "email", (err, user) => {
//     if (user !== null) {
//       res.render("passport/createuser", { message: "The email already exists" });
//       return;
//     }

//     const salt = bcrypt.genSaltSync(bcryptSalt);
//     const hashPass = bcrypt.hashSync(password, salt);

//     const newUser = new User({
//       email,
//       password: hashPass,
//       firstname,
//       lastname,
//       role
//     });

//     newUser.save((err) => {
//       if (err) {
//         res.render("passport/createuser", { message: "Something went wrong" });
//       } else {
//         // req.session.currentUser = user;
//         res.redirect("/dashboardAdmin");
//       }
//     });
//   });
// });



 //Route 4: serve up the project details & approval/denial options
 projectRouter.get('/projectdetails', function(req, res){
   res.render('projectdetails');
 });
 
console.log(router.stack)
module.exports = router;





// // PROJECT CREATE POST
// projectRouter.post("/projectcreate",uploadCloud.single('photo'),(req, res, next) => {
//   const newProject = new Project ({
//     owner: req.body.theOwner,
//     client: req.body.theClient,
//     projectname: req.body.theProjectname,
//     projectmessage: req.body.theProjectmessage
//     // need to store component (project images) but not sure how
//   });
//   newProject.save((err) => {
//     if (err) {
//       res.render("projectcreate", { message: "Something went wrong" });
//     } else {
//       // req.session.currentUser = user;
//       res.redirect("/dashboardAdmin");
//   }
//   });
// });
