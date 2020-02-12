const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, config.get("JWT_KEY"));
    req.userData = decoded; // Routes that use this middleware can access req.userData
    next();
  } catch (err) {
    return res.status(401).send({ err: "Auth failed" });
  }
};
