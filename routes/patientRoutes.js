const { Router } = require("express");
const { isVerified } = require("../controllers/userAuthentication");
const { Doctor } = require("../models/doctorSchema");
const { User } = require("../models/userSchema");

const router = require("express").Router();

const doctorDetail = {
  DOCTOR:
    "A physician, medical practitioner, medical doctor, or simply doctor, is a professional who practices medicine, which is concerned with promoting, maintaining, or restoring health through the study, diagnosis, prognosis and treatment of disease, injury, and other physical and mental impairments",
  CARDIOLOGIST:
    "Cardiologists are doctors who specialize in diagnosing and treating diseases or conditions of the heart and blood vessels—the cardiovascular system. You might also visit a cardiologist so you can learn about your risk factors for heart disease and find out what measures you can take for better heart health",
};

router.get("/bookDoctor", isVerified, (req, res) => {
  console.log("Book doctor");
  Doctor.find({})
    .populate("user")
    .exec((err, users) => {
      if (err) {
        throw err;
      }
      users.map((user) => {
        return { ...user, selected: false };
      });
      res.render("bookDoctors", {
        userobj: users,
        user: req.user,
        description: doctorDetail,
      });
    });
});

router.post("/appoint", (req, res) => {
  console.log(typeof req.body.bookingtime);

  Doctor.findById(req.body.did).exec((err, doctor) => {
    if (err) {
      throw err;
    }
    User.findOne({ _id: req.body.pid }).exec((err, patient) => {
      if (err) {
        throw err;
      }

      const avaiableTimeSlot = {
        "11:00AM-12:00PM": 5,
        "12:05PM-1:05PM": 5,
        "1:10PM-2:05PM": 5,
        "2:10PM-3:05PM": 5,
      };

      doctor.Appointements.map((appoint) => {
        if (
          avaiableTimeSlot[appoint.bookingtime] &&
          avaiableTimeSlot[appoint.bookingtime] > 0
        ) {
          avaiableTimeSlot[appoint.bookingtime] -= 1;
        }
      });
      console.log(avaiableTimeSlot[req.body.bookingtime]);
      console.log(avaiableTimeSlot);
      if (avaiableTimeSlot[req.body.bookingtime] <= 0) {
        req.flash("error", "booking slot not available");

        return res.redirect("/patients/bookDoctor");
      } else {
        doctor.Appointements.push({
          patient: patient._id,
          bookingtime: req.body.bookingtime,
        });
        doctor.save();
        patient.appointments.push({
          doctor: doctor.user,
          bookingtime: req.body.bookingtime,
        });
        patient.save();
        req.flash("error", "booking confirmed");

        return res.redirect("/patients/bookDoctor");
      }
    });
  });
  // return res.redirect("/patients/bookDoctor");
});

router.get("/myappointments", [isVerified], async (req, res) => {
  console.log(req.user._id);
  try {
    User.findOne({ _id: req.user._id })
      .populate({
        path: "appointments",
        populate: {
          path: "doctor",
          modal: "User",
        },
      })
      .exec((err, user) => {
        if (err) {
          throw err;
        }
        console.log(user);
        return res.render("myappointment", {
          Appointements: user.appointments,
        });
      });
    // await Patient.findOne({ user: req.user._id })
    // .populate("appointments")
    // .exec((err, patient) => {
    //   console.log(patient);
    // });
  } catch (error) {
    console.log(error);
  }
});

router.get("/viewprescription", [isVerified], async (req, res) => {
  console.log(req.user.Prscriptions);
  res.render("patientPrescription", { prescription: req.user.Prscriptions });
});
module.exports = router;
