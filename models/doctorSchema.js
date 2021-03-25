const mongoose = require("mongoose");
const { Schema } = mongoose;

const doctorSchema = new Schema({
  // Name:  String,
  Specialization: {
    type: String,
    default: "DOCTOR",
  },
  Experience: Number,
  Degree: {
    type: Array,
    default: [],
  },
  Appointements: [
    {
      patient: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
      },
      bookingtime: String,
    },
  ],
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    unique: true,
    require: true,
  },
});

exports.Doctor = mongoose.model("Doctor", doctorSchema);
