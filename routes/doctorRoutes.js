const { Router } = require("express");
const { isVerified } = require("../controllers/userAuthentication");
const { Doctor } = require("../models/doctorSchema");
const { Patient } = require("../models/patientSchema");

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
module.exports = router;
