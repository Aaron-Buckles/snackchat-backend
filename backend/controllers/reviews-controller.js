const { Review, validateReview } = require("../models/review");

getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("tags")
      .populate("author", "name");
    if (reviews.length === 0)
      return res.status(404).send({ err: "No Reviews found" });
    return res.status(200).send({ reviews });
  } catch (err) {
    return res.status(500).send({ err });
  }
};

getReviewById = async (req, res) => {
  try {
    const review = await (
      await Review.findById(req.params.id).populate("tags")
    ).populated("author", "name");
    console.log(review);
    if (!review) return res.status(404).send({ err: "Review not found" });
    return res.status(200).send({ review });
  } catch (err) {
    return res.status(500).send({ err });
  }
};

createReview = async (req, res) => {
  const { error } = validateReview(req.body);
  if (error) return res.status(400).send({ err: error.details[0].message });

  const review = new Review({
    title: req.body.title,
    description: req.body.description,
    starRating: req.body.starRating,
    reviewImage: req.file.path,
    tags: req.body.tags,
    author: req.userData.userId
  });

  try {
    await review.save();
    return res.status(201).send({
      review,
      message: "Review successfully created!"
    });
  } catch (err) {
    return res.status(500).send({ err });
  }
};

updateReview = async (req, res) => {
  const { error } = validateReview(req.body);
  if (error) return res.status(400).send({ err: error.details[0].message });

  try {
    const review = await Review.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      description: req.body.description,
      starRating: req.body.starRating,
      reviewImage: req.file.path
    });

    if (!review) return res.status(404).send({ err: "Review not found" });

    return res.status(200).send({
      review,
      message: "Review successfully updated!"
    });
  } catch (err) {
    res.status(500).send({ err });
  }
};

deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndRemove(req.params.id);

    if (!review) return res.status(404).send({ err: "Review not found" });

    return res.status(200).send({
      review,
      message: "Review successfully deleted!"
    });
  } catch (err) {
    res.status(500).send({ err });
  }
};

module.exports = {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
};
