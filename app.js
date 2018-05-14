require('dotenv').config();

// RUN PACKAGES
const bodyParser   = require('body-parser'); //cleans our req.body
const cookieParser = require('cookie-parser');
const express      = require('express'); //app router
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');

const User         = require("./models/user");
const session = require("express-session");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");
const multer = require('multer'); // file storing middleware


mongoose.Promise = Promise;
mongoose
  // .connect('mongodb://localhost/project-creative-app', {useMongoClient: true})
.connect(process.env.MONGODB_URI, {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express(); //This is an express app

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json()); // makes JSON work too
app.use(bodyParser.urlencoded({ extended: false })); //handle body requests
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

// add
app.use(session({
  secret: "our-project-creative-app-strategy-app",
  resave: true,
  saveUninitialized: true
}));

// add
passport.serializeUser((user, cb) => {
  cb(null, user._id);
});
// add
passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// add
app.use(flash());
passport.use(new LocalStrategy({
  passReqToCallback: true,
  usernameField:"email"
}, (req, email, password, next) => {
  User.findOne({ email }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect email" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" });
    }

    return next(null, user);
  });
}));

// add
app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'UXKat.co Creative Approval App';

const index = require('./routes/index');
const passportRouter = require("./routes/passportRouter");
app.use('/', index);
app.use('/', passportRouter);


// MULTER CONFIG: to get file photos to temp server storage
const multerConfig = {
    
  storage: multer.diskStorage({
   // Setup where the user's file will go
   destination: function(req, file, next){
     next(null, './public/photo-storage');
     },   
      
      // Give the file a unique name
      filename: function(req, file, next){
          console.log(file);
          const ext = file.mimetype.split('/')[1];
          next(null, file.fieldname + '-' + Date.now() + '.'+ext);
        }
      }),   
      
      //A means of ensuring only images are uploaded. 
      fileFilter: function(req, file, next){
            if(!file){
              next();
            }
          const image = file.mimetype.startsWith('image/');
          if(image){
            console.log('photo uploaded');
            next(null, true);
          }else{
            console.log("file not supported");
            
            // TODO:  A better message response to user on failure.
            return next();
          }
      }
    };

//Route 2: serve up the file handling solution (it really needs a better user response solution. If you try uploading anything but an image it will still say 'complete' though won't actually upload it. Stay tuned for a better solution, or even better, build your own fork/clone and pull request it back to me so we can make this thing better together for everyone out there struggling with it. 
app.post('/upload',multer(multerConfig).single('photo'),function(req,res){
  res.send('Complete!');
 });
 // Please note the .single method calls ('photo'), and that 'photo' is the name of our file-type input field!

// console.log(app._router.stack)
module.exports = app;