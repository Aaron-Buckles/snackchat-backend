const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userData = decoded; // Routes that use this middleware can access req.userData
    next();
  } catch (err) {
    return res
      .status(401)
      .send({ err: "Authentication failed, you must login" });
  }
};
