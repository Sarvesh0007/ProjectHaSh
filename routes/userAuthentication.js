const {
  userSignedin,
  signin,
  signup,
} = require("../controllers/userAuthentication");

const router = require("express").Router();

// routes to handle display of login view
router.get("/login", userSignedin, (req, res) => {
  res.render("login");
});

// routes to handle display of register view
router.get("/register", userSignedin, (req, res) => {
  res.render("register");
});

// routes to handle logic of login view
router.post("/login", signin);

// routes to handle logic of register view
router.post("/register", signup);

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/user/login");
});
module.exports = router;
