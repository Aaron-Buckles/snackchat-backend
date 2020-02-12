const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const Review = mongoose.model(
  "Review",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    description: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 500
    },
    starRating: {
      type: Number,
      required: true,
      min: 0,
      max: 5
    },
    reviewImage: { type: String, required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes: { type: Number, default: 0 }
  })
);

function validateReview(review) {
  const schema = Joi.object({
    title: Joi.string()
      .min(5)
      .max(50)
      .required(),
    description: Joi.string()
      .min(5)
      .max(500)
      .required(),
    starRating: Joi.number()
      .min(0)
      .max(5)
      .required(),
    tags: Joi.array(),
    likes: Joi.number()
  });

  return schema.validate(review);
}

module.exports.Review = Review;
module.exports.validateReview = validateReview;
