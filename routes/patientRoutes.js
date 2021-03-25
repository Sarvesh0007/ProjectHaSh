const { Router } = require("express");
const { isVerified } = require("../controllers/userAuthentication");
const { Doctor } = require("../models/doctorSchema");
const { Patient } = require("../models/patientSchema");

const router = require("express").Router();

const doctorDetail = {
  DOCTOR:
    "A physician, medical practitioner, medical doctor, or simply doctor, is a professional who practices medicine, which is concerned with promoting, maintaining, or restoring health through the study, diagnosis, prognosis and treatment of disease, injury, and other physical and mental impairments",
  CARDIOLOGIST:
    "Cardiologists are doctors who specialize in diagnosing and treating diseases or conditions of the heart and blood vessels—the cardiovascular system. You might also visit a cardiologist so you can learn about your risk factors for heart disease and find out what measures you can take for better heart health",
};

router.get("/bookDoctor", (req, res) => {
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
    Patient.findOne({ user: req.body.pid }).exec((err, patient) => {
      if (err) {
        throw err;
      }

      doctor.Appointements.push({
        patient: patient.user,
        bookingtime: req.body.bookingtime,
      });
      doctor.save();
      patient.appointments.push({
        doctor: doctor.user,
        bookingtime: req.body.bookingtime,
      });
      patient.save();
    });
  });
  res.redirect("/patients/bookDoctor");
});

router.get("/myappointments", [isVerified], async (req, res) => {
  try {
    Patient.findOne({ user: req.user._id })
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
module.exports = router;
