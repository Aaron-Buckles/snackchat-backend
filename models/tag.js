const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const Tag = mongoose.model(
  "Tag",
  new mongoose.Schema({
    name: { type: String, required: true }
  })
);

function validateTag(tag) {
  const schema = Joi.object({
    name: Joi.string().required()
  });

  return schema.validate(tag);
}

module.exports.Tag = Tag;
module.exports.validateTag = validateTag;
