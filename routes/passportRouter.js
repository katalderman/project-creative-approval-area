const express        = require("express");
const router         = express.Router();
const bcrypt         = require("bcrypt"); // Bcrypt to encrypt passwords
const bcryptSalt     = 10;
const ensureLogin   = require("connect-ensure-login");
const passport      = require("passport");

// User model
const User           = require("../models/user");
// const userRouter  = express.Router();

// createuser GET
router.get("/createuser", (req, res, next) => {
  res.render("passport/createuser");
});

// createuser POST
router.post("/createuser", (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const role = req.body.role;

  if (email === "" || password === "") {
    res.render("passport/createuser", { message: "Indicate email and password" });
    return;
  }

  User.findOne({ email }, "email", (err, user) => {
    if (user !== null) {
      res.render("passport/createuser", { message: "The email already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      email,
      password: hashPass,
      firstname,
      lastname,
      role
    });

    newUser.save((err) => {
      if (err) {
        res.render("passport/createuser", { message: "Something went wrong" });
      } else {
        // req.session.currentUser = user;
        res.redirect("/dashboardAdmin");
      }
    });
  });
});

// get route to display the form to edit the user
router.get('/edituser/:id', (req, res, next) => {
  const userId = req.params.id;
  User.findById(userId)
  .then(userFromDb => {
    var isAdmin = false;
    var isClient =false;
    // console.log("blah",userFromDb.role)
    // console.log("before: ", isAdmin)
    if(userFromDb.role === 'ADMIN'){
      // console.log("inside")
      isAdmin = true
    }
    // console.log("after: ", isAdmin)
    if(userFromDb.role === 'CLIENT'){
      isClient = true
    }
    // console.log("user thing: ", userFromDb)
    res.render('passport/edituser', {user: userFromDb, isAdmin, isClient})
  })
}) 

// EDIT - POST ROUTE
router.post('/edituser/:id', (req, res, next) => {

  const userId = req.params.id;
  const editedEmail = req.body.editedEmail;
  const editedPassword = req.body.editedPassword;
  const editedFirstname = req.body.editedFirstname;
  const editedLastname = req.body.editedLastname;
  const editedRole = req.body.role;
  
  console.log("edit page: ", req.body, userId)

  // console.log("editedFirstname: ", editedFirstname)
  User.findByIdAndUpdate(userId, {
      email: editedEmail,
      password: editedPassword,
      firstname: editedFirstname,
      lastname: editedLastname,
      role: editedRole
  })
  .then(() => {
      res.redirect('/dashboardAdmin')
  })
  .catch( error => {
      console.log("Error while updating: ", error)
  })
})

// DELETE 
router.delete('/users/:id', (req, res, next) => {
  const userId = req.params.id;
  User.findByIdAndRemove(userId)
  .then(() => {
    res.status(200).send()
  })
  .catch( error => {
      console.log("Error while deleting: ", error)
  })
})

// createuser GET
router.get("/viewuser", (req, res, next) => {
  res.render("passport/viewuser");
});


// LOGIN GET
router.get("/login", (req, res, next) => {
  res.render("passport/login", { "message": req.flash("error") });
});

// LOGIN POST
router.post("/login", passport.authenticate("local", {
  successRedirect: "/dashboardAdmin",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

// LOGOUT
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});


// console.log(router.stack)
module.exports = router;