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
router.post("/projectcreate", uploadCloud.single('imgPath'), function(req,res) {
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


// // projectcreate POST
// router.post("/projectcreate", (req, res, next) => {
// const owner = req.body.theOwner;
// const client = req.body.theClient;
// const projectName = req.body.theProjectName;
// const projectMessage = req.body.theProjectMessage;
// const imgPath = req.file.url;

//     const newProject = new Project({
//       owner,
//       client,
//       projectName,
//       projectMessage,
//       imgPath
//     });

//     newProject.save((err) => {
//       if (err) {
//         res.render("passport/projectcreate", { message: "Something went wrong" });
//       } else {
//         // req.session.currentProject = project;
//         res.redirect("/dashboardAdmin");
//       }
//     });
//   });



 //Route 4: serve up the project details & approval/denial options
 router.get('/projectdetails', function(req, res){
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
