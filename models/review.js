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
    reviewImageURL: { type: String, required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
    likeCount: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
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
    reviewImageURL: Joi.string().required(),
    tags: Joi.array(),
    likeCount: Joi.number(),
    businessId: Joi.string()
  });

  return schema.validate(review);
}

module.exports.Review = Review;
module.exports.validateReview = validateReview;
