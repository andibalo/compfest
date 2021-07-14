const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    doctor_name: {
      type: String,
      required: true,
      trim: true,
    },
    appointment_date: {
      type: String,
      required: true,
      trim: true,
    },

    appointment_description: {
      type: String,
      required: true,
      trim: true,
    },
    registrants_list: [
      {
        patient: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
      },
    ],
    max_registrants: {
      type: Number,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = Appointment = mongoose.model("appointment", appointmentSchema);
