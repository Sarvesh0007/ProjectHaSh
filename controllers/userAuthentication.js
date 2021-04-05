const passport = require("passport");
const { User } = require("../models/userSchema");
/**
 *  signin handle method based on legacy credential
 * @param {Request} req request header
 * @param {Response} res response header
 * @param {next} next
 */

exports.signin = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/test1",
    failureRedirect: "/user/login",
    failureFlash: true,
  })(req, res, next);
};

/**
 *  signup method based on legacy credentials
 * @param {Request} req request heaeder
 * @param {Response} res response header
 * @param {next} next
 */

exports.signup = (req, res) => {
  console.log(req.body);
  const mailpattern = new RegExp(
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$"
  );
  if (req.body.email.match(mailpattern)) {
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          // if user does not exist create the user
          const newUser = new User(req.body);
          newUser.save();
          console.log(newUser);
          return res.redirect("/user/login");
        }
        return res.status(405).send({ error: "User already exist" });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    req.flash("error", "invalid email format");
  }
};

/**
 *  middleware to verify wheather request comig is authenticated or no
 * @param {Request} req
 * @param {Response} response
 * @param {next} next
 */
exports.isVerified = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send("You are not allowed to view this page");
  }
  next();
};

/**
 * handler to chek if user is logged in redirect to some other page if try to access login or register page
 * @param {Request} req request header
 * @param {Response} res response header
 * @param {next} next
 */
exports.userSignedin = (req, res, next) => {
  // if (req.isAuthenticated()) {
  next();
  // }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 8990) {
    return res.status(401).send("Unautorized user");
  }
  next();
};
