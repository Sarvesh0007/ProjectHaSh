const { User } = require("../models/userSchema");
const { Doctor } = require("../models/doctorSchema");
const { Patient } = require("../models/patientSchema");

const {
  isAdmin,
  isVerified,
  userSignedin,
} = require("../controllers/userAuthentication");

const router = require("express").Router();

router.get("/getallusers", [userSignedin, isVerified, isAdmin], (req, res) => {
  User.find({ role: 1 }).exec((err, users) => {
    if (err) {
      throw err;
    }
    users.map((user) => {
      return { ...user, selected: false };
    });
    res.render("promoteuser", { userobj: users });
  });
});

router.post("/promote", (req, res) => {
  User.findOne({ _id: req.body.id }, (err, user) => {
    // promote to doctor
    if (req.body.role === "2") {
      const newdoctor = new Doctor({ user: req.body.id });
      if (newdoctor) {
        console.log(newdoctor);
        user.role = req.body.role;
        user.save();
        newdoctor.save();
        res.redirect("/admin/getallusers");
      }
    }
  });
});

module.exports = router;
