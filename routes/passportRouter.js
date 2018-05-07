const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");



// createuser GET
router.get("/createuser", (req, res, next) => {
  res.render("passport/createuser");
});

// createuser POST
router.post("/createuser", (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

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
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("passport/createuser", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});



// LOGIN GET
router.get("/login", (req, res, next) => {
  res.render("passport/login", { "message": req.flash("error") });
});
// LOGIN POST
router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));


// PRIVATE PAGE - PROJECT CREATE
router.get("/projectcreate", ensureLogin.ensureLoggedIn(), (req, res) => {
  console.log("the user is: ", req.user)
  if(req.user.role === 'ADMIN'){
    res.render("projectcreate", { user: req.user });
  } else {
    res.send("Sorry!")
  }
});



// PRIVATE PAGE
router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

// LOGOUT
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});


module.exports = router;