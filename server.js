const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");
const flashconnect = require("connect-flash");
const { dbConnect } = require("./utils/dbconnect");

//controllers handler
const { isVerified, isAdmin } = require("./controllers/userAuthentication");
//routes import
const userAuthRoutes = require("./routes/userAuthentication");
const adminRoutes = require("./routes/adminRoutes");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
// for using .env
require("dotenv").config();

// using local strategy for authentication
require("./config/passportlocal-startegy")(passport);

//----------------------------------------------------------------------------------------------------------------------------------------------

//gloabl variables
const APP = express();
const PORT = process.env.PORT || 3000;

//----------------------------------------------------------------------------------------------------------------------------------------------

// database connection
if (dbConnect(process.env.MONGO_URI)) {
  console.log("Database connected");
} else {
  console.log("Database connection fail");
}
//----------------------------------------------------------------------------------------------------------------------------------------------

//EJS
APP.use(expressLayouts);
APP.set("view engine", "ejs");
APP.use(express.static("public"));

//middleware's
APP.use(express.json());
APP.use(express.urlencoded({ extended: true }));

// logger
APP.use(morgan("dev"));

// session i.e express-session
APP.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: { _expires: 120000 },
  })
);
APP.use(flashconnect());
APP.use(passport.initialize());
APP.use(passport.session());

APP.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error = req.flash("error");

  next();
});

APP.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});

// -------------------------------------------------------------------------------------------------------------------------------------------

//routes
APP.use("/user", userAuthRoutes);
APP.use("/admin", adminRoutes);
APP.use("/patients", patientRoutes);
APP.use("/doctors", doctorRoutes);
APP.get("/", (req, res) => {
  return res.render("Home");
});
APP.get("/test", [isVerified, isAdmin], (req, res) => {
  return res.send("You have Successfully Logged In");
});
APP.get("/test1", (req, res) => {
  if (req.user.role === 1) {
    return res.redirect("/patients/bookDoctor");
  }
  return res.redirect("/");
});

//test routes
APP.get("*", (req, res) => {
  res.render("404");
});

//----------------------------------------------------------------------------------------------------------------------------------------------
// server started
APP.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`server started on port ${PORT}`);
  }
});
