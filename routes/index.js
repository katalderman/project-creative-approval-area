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

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

// // PROJECT CREATE GET
// router.get("/projectcreate", ensureLogin.ensureLoggedIn(), (req, res) => {
//   // console.log("the user is: ", req.user)
//   if(req.user.role === 'ADMIN'){

//     User.find({})
//   .then( user => {

//     res.render("projectcreate", { user });
//   }) } else {
//     res.send("Sorry!")
//   }
// });


// // PROJECT CREATE POST
// router.post('/projectcreate',uploadCloud.single('photo'),(req, res, next) => {
//     const newProject = new Project ({
//       owner: req.body.theOwner,
//       client: req.body.theClient,
//       projectname: req.body.theProjectname,
//       projectmessage: req.body.theProjectmessage
//       // need to store component (project images) but not sure how
//     });
//     newProject.save((err) => {
//       if (err) {
//         res.render("projectcreate", { message: "Something went wrong" });
//       } else {
//         // req.session.currentUser = user;
//         res.redirect("/dashboardAdmin");
//     }
//     });
//   });


function renderDashboard(req,res,next) {
  User.find({})
  .then( user => {
    console.log(user);
      res.render('dashboardAdmin', { 
        user: user,
        redirectLocation: req.protocol+'://'+req.hostname+':3000'+'/dashboardAdmin'
       });
  } )
  .catch( error => {
      console.log("Error while displaying:", error );
  } )}


 // serve up the admin area
 router.get('/dashboardAdmin', function(req, res, next){
   renderDashboard(req,res,next);
  // // console.log(req.session);
  // User.find({})
  // .then( user => {
  //   console.log(user);
  //     res.render('dashboardAdmin', { user });
  // } )
  // .catch( error => {
  //     console.log("Error while displaying:", error );
  // } )
  // //  res.render('dashboardAdmin');
 });

//  //Route 4: serve up the project details & approval/denial options
//  router.get('/projectdetails', function(req, res){
//    res.render('projectdetails');
//  });
 
 // serve up the user details
 router.get('/viewuser', function(req, res){
   console.log('who is logged in: ', req.user)
   res.render('passport/viewuser', { user: req.user });
 });


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


 //Route 4: serve up the project details & approval/denial options
 router.get('/projectdetails', function(req, res){
  res.render('projectdetails');
});

console.log(router.stack)




    // const projOwner= req.body.theOwner;
    // const projClient= req.body.theClient;
    // const projProjectname= req.body.theProjectname;
    // const projProjectmessage= req.body.theProjectmessage;


// // PROJECT CREATE POST
// router.post('/create',uploadCloud.single('photo'),(req, res, next) => {
//   Project.create({
//     owner: req.body.owner,
//     client: req.body.client,
//     projectname: req.body.projectname,
//     projectmessage: req.body.projectmessage,
//     // component: req.body.component, //im not sure what to do about the object in the db here
//     // imgPath: req.file.url, // and here
//     password: req.body.password
//   })
//   .then((theProject)=>{
//     res.redirect('/dashboardAdmin')
//   })
// });



// // DISPLAY ALL THE USERS
// // url: localhost:3000/viewuser
// router.get('/viewuser', (req, res, next) => {
//   console.log(req.user);
//   User.findById(req.user._id)
//   .then( responseFromDB => {
//     console.log(responseFromDB);
//       res.render('passport/viewuser', { user: responseFromDB });
//   } )
//   .catch( error => {
//       console.log("Error while displaying:", error );
//   } )
// });



// /* GET dashboard for admins */
// router.get('/dashboardAdmin', (req, res, next) => {
//   Project.find()
//   .then((allProjects)=> {
//     res.render('index',{projects:allProjects})
//   })
//   .catch((err)=>{
//     console.log(err)
//   })
// });


module.exports = router;
