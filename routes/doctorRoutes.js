const { Router } = require("express");
const { isVerified } = require("../controllers/userAuthentication");
const { Doctor } = require("../models/doctorSchema");
const { Patient } = require("../models/patientSchema");
const { User } = require("../models/userSchema");

const router = require("express").Router();
router.get("/myappointments", [isVerified], async (req, res) => {
  try {
    Doctor.findOne({ user: req.user._id })
      .populate({
        path: "Appointements",
        populate: {
          path: "patient",
          modal: "User",
        },
      })
      .exec((err, user) => {
        if (err) {
          throw err;
        }
        console.log(user.Appointements);
        return res.render("doctorsappointment", {
          Appointements: user.Appointements,
        });
      });
  } catch (error) {
    console.log(error);
  }
});

router.get("/removeappointments/:id", (req, res) => {
  const appointement = req.params.id;
  console.log(appointement);
  try {
    Doctor.findOne({ user: req.user._id }).exec((err, user) => {
      console.log(user.Appointements);
      const updatedAppointementList = user.Appointements.filter(
        (item) => item._id.toString() !== appointement.toString()
      );
      user.Appointements = updatedAppointementList;
      user.save();
      return res.redirect("/doctors/myappointments");
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/viewappointements/:id", (req, res) => {
  User.findOne({ _id: req.params.id }, (err, user) => {
    console.log(user);
    return res.render("appointementDetail", { patient: user });
  });
});

router.post("/addprescription", async (req, res) => {
  const id = req.body.patientid;
  delete req.body.patientid;
  console.log(req.body);
  User.findOne({ _id: id }, async (err, user) => {
    if (!user) {
      return res.status(400).send({ error: "Bad request" });
    }
    console.log({
      Disease: req.body.Disease,
      Medicine: req.body.Medicine.split(","),
    });
    user.Prscriptions.push({
      doctor: req.user.name,
      date: new Date().toUTCString(),
      Disease: req.body.Disease,
      Medicine: req.body.Medicine.split(","),
    });
    await user.save();
    console.log(user);
    req.flash("error", "visited successfully");

    return res.redirect("/doctors/myappointments");
  });
});

module.exports = router;
