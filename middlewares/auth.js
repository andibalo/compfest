const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.validateToken = (req, res, next) => {
  const token = req.header("Authorization");
  //console.log(req.headers);
  if (!token) {
    return res.status(401).json({ msg: "No token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.user;

    next();
  } catch (error) {
    console.log(error);

    res.status(401).json({ msg: "token is invalid" });
  }
};

exports.validateAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.id });

    if (user.role !== "admin") {
      return res.status(403).json({ error: "This user is not authorized!" });
    }

    next();
  } catch (error) {
    return res.status(500).json(error);
  }
};
