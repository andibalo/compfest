const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateToken } = require("../middlewares/auth");

//@Route        /api/user/me
//@Desc         get current user
//@Access       private

router.get("/me", validateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "user not found",
      });
    }

    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
});

//@Route        /api/user/register
//@Desc         Signup a user
//@Access       Public

router.post(
  "/register",
  [
    check("first_name", "First Name is required").notEmpty(),
    check("last_name", "Last Name is required").notEmpty(),
    check("age", "Gender is required").notEmpty(),
    check("username", "Username is required").notEmpty(),
    check("email", "Email is required")
      .notEmpty()
      .isEmail()
      .withMessage("Email must be in correct format"),
    check("password", "Password is required")
      .notEmpty()
      .isLength({
        min: 6,
      })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ status: "error", errors: errors.array() });
    }

    const { username, email, password, first_name, last_name, age } = req.body;

    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({
          status: "error",
          message: "User already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await new User({
        username,
        email,
        password: hashedPassword,
        first_name,
        last_name,
        age,
      }).save();

      const payload = {
        user: {
          id: user._id.toString(),
        },
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET);

      res.json({
        status: "success",
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: "error",
        message: error,
      });
    }
  }
);

//@Route        /api/user/login
//@Desc         login a user
//@Access       Public

router.post(
  "/login",
  [
    check("email", "Email is required")
      .notEmpty()
      .isEmail()
      .withMessage("Email must be in correct format"),
    check("password", "Password is required")
      .notEmpty()
      .isLength({
        min: 6,
      })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          status: "error",
          message: "Wrong email/password",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(404).send({
          status: "error",
          message: "Wrong email/password",
        });
      }

      const payload = {
        user: {
          id: user._id.toString(),
        },
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET);

      res.json({
        status: "success",
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      console.log(error);

      res.send("server error");
    }
  }
);

module.exports = router;
