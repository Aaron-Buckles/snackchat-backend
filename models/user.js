const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
const Joi = require("@hapi/joi");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    likedReviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    preferences: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }]
  }).plugin(uniqueValidator)
);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .max(50),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().required(),
    preferences: Joi.array()
  });

  return schema.validate(user);
}

module.exports.User = User;
module.exports.validateUser = validateUser;
