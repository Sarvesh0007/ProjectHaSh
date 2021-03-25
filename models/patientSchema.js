const mongoose = require("mongoose");
const { Schema } = mongoose;

const patientSchema = new Schema({
  //   Name:  String, // String is shorthand for {type: String}
  //   Age: Number,
  //   Gender:  {
  //       type: String,
  //       enum: ["M","F","Other"]

  //   },
  //   Email: {
  //       type: String,
  //       unique: true,
  //       required: true
  //   },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    unique: true,
    required: true,
  },
  Address: String,
  Prscriptions: [
    {
      Disease: String,
      Medicine: [
        {
          Name: String,
          Dosage: {
            type: String,
            enum: ["Day", "Afternoon", "Evening", "Night"],
          },
        },
      ],
    },
  ],
  appointments: [
    {
      doctor: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
      },
      bookingtime: String,
    },
  ],
});

exports.Patient = mongoose.model("Patient", patientSchema);
