const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const { User, validateUser } = require("../models/user");

getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });
    res.status(200).send({ user });
  } catch (err) {
    res.status(200).send({ err });
  }
};

createUser = (req, res) => {
  const saveUser = async (hash, req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send({ err: error.details[0].message });

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hash
    });

    try {
      await user.save();
      res.status(201).send({
        message: "Created user successfully"
      });
    } catch (err) {
      res.status(500).send({ err });
    }
  };

  bcrypt.hash(req.body.password, 15, (err, hash) => {
    if (err) {
      return res.status(500).send({ err });
    } else {
      saveUser(hash, req, res);
    }
  });
};

loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (!user) {
      return res.status(401).send({ err: "Login failed" });
    }
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (err || !result) {
        return res.status(401).send({ err: "Login failed" });
      }
      const token = jwt.sign(
        {
          name: user.name,
          email: user.email,
          userId: user._id
        },
        config.get("JWT_KEY"),
        {
          expiresIn: "1h"
        }
      );
      return res.status(200).send({ token, message: "Login successful" });
    });
  } catch (err) {
    return res.status(500).send({ err });
  }
};

deleteUser = async (req, res) => {
  try {
    await User.remove({ _id: req.params.userId });
    res.status(200).send({
      message: "Deleted user successfully"
    });
  } catch (err) {
    res.status(200).send({ err });
  }
};

module.exports = {
  getUser,
  createUser,
  loginUser,
  deleteUser
};
