const express        = require("express");
const router         = express.Router();
const ensureLogin   = require("connect-ensure-login");
const passport      = require("passport");

// User model
const Project           = require("../models/project");
// const userRouter  = express.Router();

// projectcreate GET
router.get("/projectcreate", (req, res, next) => {
  res.render("projectcreate");
});

// projectcreate POST
router.post("/projectcreate", (req, res, next) => {
  const projectid = req.params.id;
  const editedowner = req.body.editedowner;
  const editedclient = req.body.editedclient;
  const editedprojectname = req.body.editedprojectname;
  const editedprojectmessage = req.body.editedprojectmessage;
  }

  Project.findOne({ email }, "email", (err, project) => {
    if (project !== null) {
      res.render("projectcreate", { message: "The project already exists" });
      return;
    }

    const newProject = new Project({
      owner,
      client,
      projectname,
      projectmessage,
      isapproved
    });

    newProject.save((err) => {
      if (err) {
        res.render("projectcreate", { message: "Something went wrong" });
      } else {
        res.redirect("/dashboardAdmin");
      }
    });

// PROJECT EDIT - FORM DISPLAY
router.get('/projectdetails/:id', (req, res, next) => {
  const projectId = req.params.id;
  Project.findById(projectId)
  .then(projectFromDb => {
    res.render('projectdetails', {project: projectFromDb})
  })
}) 

// PROJECT EDIT - POST ROUTE
router.post('/projectdetails/:id', (req, res, next) => {
  const projectid = req.params.id;
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
      res.redirect('/projectdetails')
  })
  .catch( error => {
      console.log("Error while updating: ", error)
  })
})


// PROJECT DELETE 
router.delete('projects/:id', (req, res, next) => {
  const projectId = req.params.id;
  User.findByIdAndRemove(projectId)
  .then(() => {
      res.redirect("/dashboardAdmin");
  })
  .catch( error => {
      console.log("Error while deleting: ", error)
  })
})

module.exports = router;