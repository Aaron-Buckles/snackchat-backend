const crypto = require("crypto");
const path = require("path");
const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/reviews-controller");
const checkAuth = require("../middleware/check-auth");

// Multer
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      crypto.randomBytes(25).toString("hex") + path.extname(file.originalname)
    );
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else cb(new Error("The image must be either jpeg or png"));
};
const upload = multer({ storage, fileFilter });

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
router.post(
  "/",
  checkAuth,
  upload.single("reviewImage"),
  ReviewController.createReview
);
router.post("/:id/like", checkAuth, ReviewController.likeReview);
router.post("/:id/unlike", checkAuth, ReviewController.unlikeReview);
router.put(
  "/:id",
  checkAuth,
  upload.single("reviewImage"),
  ReviewController.updateReview
);
router.delete("/:id", checkAuth, ReviewController.deleteReview);

module.exports = router;
