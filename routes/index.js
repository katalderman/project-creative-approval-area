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

/* render dashboard contents -- project */
function renderDashboard(req,res,next) { 
  Project.find({})
  .then( project => {
    // console.log(project);
    User.find({})
    .then( user => {
      // console.log(user);
        res.render('dashboardAdmin', { 
          user: user,
          project: project,
          redirectLocation: req.protocol+'://'+req.hostname+':3000'+'/dashboardAdmin'
         });
    } )
    .catch( error => {
        console.log("Error while displaying:", error );
    } )
  .catch( error => {
      console.log("Error while displaying:", error );
  });
});
}

 // serve up the admin area
 router.get('/dashboardAdmin', function(req, res, next){
   renderDashboard(req,res,next);
 });
 
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

// PROJECT EDIT - FORM DISPLAY
router.get('/projectdetails/:id', (req, res, next) => {
  User.find() 
  .then((users) => {
    const projectId = req.params.id;
    Project.findById(projectId)
    .then(projectFromDb => {
      res.render('projectdetails', {project: projectFromDb, user:users})
    })

  })

}) 

// PROJECT EDIT - POST ROUTE
router.post('/projectdetails/:id', (req, res, next) => {
  const projectId = req.params.id;
  const editedowner = req.body.editedowner;
  const editedclient = req.body.editedclient;
  const editedprojectname = req.body.editedprojectname;
  const editedprojectmessage = req.body.editedprojectmessage;
  // console.log("edit page: ", req.body, projectId)
  Project.findByIdAndUpdate(projectId, {
    owner: editedowner,
    client: editedclient,
    projectName: editedprojectname,
    projectMessage: editedprojectmessage
})
  .then(() => {
      res.redirect('/dashboardAdmin')
  })
  .catch( error => {
      console.log("Error while updating: ", error)
  })
})


// PROJECT DELETE 
router.delete('/projects/:id', (req, res, next) => {
  const projectId = req.params.id;
  Project.findByIdAndRemove(projectId)
  .then(() => {
    // console.log("--------------------deleted")
    res.status(200).send();
    // req.method = 'GET'
    //   res.redirect("/dashboardAdmin");
  })
  .catch( error => {
      console.log("Error while deleting: ", error)
  })
})


// console.log(router.stack)
module.exports = router;