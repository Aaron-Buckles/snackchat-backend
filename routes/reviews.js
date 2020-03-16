const crypto = require("crypto");
const path = require("path");
const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/reviews-controller");
const checkAuth = require("../middleware/check-auth");

const skipIfQuery = function(middleware) {
  return function(req, res, next) {
    console.log(req.query);
    if (req.query.long) return next();
    return middleware(req, res, next);
  };
};

router.get(
  "/",
  skipIfQuery(ReviewController.getReviews),
  ReviewController.getReviewsInRadius
);
router.get("/:id", ReviewController.getReviewById);
router.post("/", checkAuth, ReviewController.createReview);
router.post("/:id/like", checkAuth, ReviewController.likeReview);
router.post("/:id/unlike", checkAuth, ReviewController.unlikeReview);
router.put("/:id", checkAuth, ReviewController.updateReview);
router.delete("/:id", checkAuth, ReviewController.deleteReview);

module.exports = router;
