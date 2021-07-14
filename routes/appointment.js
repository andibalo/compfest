const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateToken, validateAdmin } = require("../middlewares/auth");

//@Route        POST /api/appointment
//@Desc         create an appointment
//@Access       private

router.post(
  "/",
  [
    check("doctor_name", "Doctor name is required").notEmpty(),
    check("appointment_date", "Appointment date is required").notEmpty(),
    check(
      "appointment_description",
      "Appointment description is required"
    ).notEmpty(),
    check(
      "max_registrants",
      "Maximum number of registrants is required"
    ).notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ status: "error", errors: errors.array() });
    }

    const {
      appointmentDate,
      appointmentDescription,
      doctorName,
      maxRegistrants,
    } = req.body;

    try {
      const appointment = await new Appointment({
        doctor_name: doctorName,
        appointment_date: appointmentDate,
        appointment_description: appointmentDescription,
        registrants_list: [],
        max_registrants: maxRegistrants,
      }).save();

      res.json({
        status: "success",
        data: appointment,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("server error");
    }
  }
);

//@Route        PUT /api/appointment/:id
//@Desc         create an appointment
//@Access       private

router.put(
  "/:id",
  [
    check("doctor_name", "Doctor name is required").notEmpty(),
    check("appointment_date", "Appointment date is required").notEmpty(),
    check(
      "appointment_description",
      "Appointment description is required"
    ).notEmpty(),
    check(
      "max_registrants",
      "Maximum number of registrants is required"
    ).notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ status: "error", errors: errors.array() });
    }

    const {
      doctor_name,
      appointment_date,
      appointment_description,
      registrants_list,
      max_registrants,
    } = req.body;

    console.log("EDIT", req.params);
    try {
      const appointment = await Appointment.findOneAndUpdate(
        { _id: req.params.id },
        {
          doctor_name,
          appointment_date,
          appointment_description,
          registrants_list,
          max_registrants,
        },
        { new: true }
      );

      res.json({
        status: "success",
        data: appointment,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("server error");
    }
  }
);

//@Route        PUT /api/appointment/register/:id
//@Desc         apply for an appointment
//@Access       private

router.put("/register/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    const isAppintmentAlreadyExist =
      appointment.registrants_list.filter(
        (registrant) => registrant.patient.toString() === req.body.userId
      ).length > 0;

    if (isAppintmentAlreadyExist) {
      return res.status(400).json({
        status: "error",
        message: "You have already applied for this appointment.",
      });
    }

    appointment.registrants_list.push({ patient: req.body.userId });

    if (appointment.registrants_list.length > appointment.max_registrants) {
      return res.status(400).json({
        status: "error",
        message: "This appointment already has maximum registrants.",
      });
    }

    await appointment.save();

    res.json({
      status: "success",
      data: appointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
});

//@Route        PUT /api/appointment/cancel/:id
//@Desc         cancel an appointment
//@Access       private

router.put("/cancel/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    const isAppointmentNotApplied =
      appointment.registrants_list.filter(
        (registrant) => registrant.patient.toString() === req.body.userId
      ).length === 0;

    if (isAppointmentNotApplied) {
      return res.status(400).json({
        status: "error",
        message: "You have not applied for this appointment.",
      });
    }

    const removeIndex = appointment.registrants_list
      .map((registrant) => registrant.patient)
      .indexOf(req.body.userId);

    appointment.registrants_list.splice(removeIndex, 1);

    await appointment.save();

    res.json({
      status: "success",
      data: appointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
});

//@Route        GET /api/appointment
//@Desc         get doctor appointments
//@Access       Public

router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find({}).sort({ createdAt: "desc" });

    res.json({
      status: "success",
      data: {
        appointments,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      message: error,
    });
  }
});

//@Route        GET /api/appointment/:id
//@Desc         get a doctor appointment
//@Access       Public

router.get("/:id", async (req, res) => {
  console.log(req.params);
  try {
    const appointment = await Appointment.findById({
      _id: req.params.id,
    }).populate("registrants_list.patient");

    if (!appointment) {
      return res.status(404).json({
        status: "error",
        message: "Appointment not found",
      });
    }

    res.json({
      status: "success",
      data: appointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

//@Route        DELETE /api/appointment/:id
//@Desc         delete a doctor appointment
//@Access       Public

router.delete("/:id", async (req, res) => {
  console.log(req.params);
  try {
    const appointment = await Appointment.findOneAndRemove({
      _id: req.params.id,
    });

    if (!appointment) {
      return res.status(404).json({
        status: "error",
        message: "Appointment not found",
      });
    }

    res.json({
      status: "success",
      data: appointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
