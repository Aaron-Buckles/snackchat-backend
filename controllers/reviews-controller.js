const { Review, validateReview } = require("../models/review");
const { Business } = require("../models/business");
const { User } = require("../models/user");

getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .sort("-likeCount")
      .populate("tags")
      .populate("author", "name")
      .populate("businessId");
    return res.status(200).send({ reviews });
  } catch (err) {
    return res.status(500).send({ err });
  }
};

getReviewsInRadius = async (req, res) => {
  var milesToRadian = function(miles) {
    var earthRadiusInMiles = 3959;
    return miles / earthRadiusInMiles;
  };

  const long = req.query.long;
  const lat = req.query.lat;
  const miles = req.query.miles;
  const limit = parseInt(req.query.limit);

  try {
    var query = {
      location: {
        $geoWithin: {
          $centerSphere: [[long, lat], milesToRadian(miles)]
        }
      }
    };

    const businessIds = await Business.find(query).select("_id");
    const reviews = await Review.find({ businessId: { $in: businessIds } })
      .limit(limit)
      .sort("-likeCount")
      .populate("tags")
      .populate("author", "name")
      .populate("businessId");

    return res.status(200).send({ reviews });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
};

getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("tags")
      .populate("author", "name");
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
    author: req.userData.userId,
    businessId: req.body.businessId
  });

  try {
    await review.save();

    await Business.findByIdAndUpdate(req.body.businessId, {
      $addToSet: { reviews: review._id, tags: review.tags },
      $inc: { reviewCount: 1 }
    });

    return res.status(201).send({
      review,
      message: "Review successfully created!"
    });
  } catch (err) {
    return res.status(500).send({ err });
  }
};

likeReview = async (req, res) => {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { likeCount: 1 }, $addToSet: { likes: req.userData.userId } }
    ).exec();

    await User.findByIdAndUpdate(req.userData.userId, {
      $addToSet: { likedReviews: review._id }
    });


    const agg = await User.aggregate([
      {
        '$lookup': {
          'from': 'reviews',
          'localField': 'likedReviews',
          'foreignField': '_id',
          'as': 'likedReviews'
        }
      }, {
        '$unwind': {
          'path': '$likedReviews'
        }
      }, {
        '$unwind': {
          'path': '$likedReviews.tags'
        }
      }, {
        '$group': {
          '_id': '$likedReviews.tags',
          'number': {
            '$sum': 1
          }
        }
      }, {
        '$match': {
          'number': { "$gte": 4 }
        }
      }
    ])

    console.log(agg)

    await User.findByIdAndUpdate(req.userData.userId, {
      $addToSet: { preferences: { $each: agg} }
    });

    return res.status(200).send({
      message: "Successfully liked review!"
    });
  } catch (err) {
    return res.status(500).send({ err });
  }
};

unlikeReview = async (req, res) => {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { likeCount: -1 }, $pull: { likes: req.userData.userId } }
    ).exec();

    await User.findByIdAndUpdate(req.userData.userId, {
      $pull: { likedReviews: review._id }
    });

    return res.status(200).send({
      message: "Successfully unliked review!"
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
  getReviewsInRadius,
  getReviewById,
  likeReview,
  unlikeReview,
  createReview,
  updateReview,
  deleteReview
};
