const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const Business = mongoose.model(
    "Business",
    new mongoose.Schema({
        name: String,
        address: String,
        city: String,
        state: String,
        postal_code: String,
        location: {
            type: { type: String },
            coordinates: [Number]
        },
        starRating: { type: Number, default: 0 },
        reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
        review_count: { type: Number, default: 0 },
        is_open: Number,
        tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }]
    })
);

function validateBusiness(business) {
    const schema = Joi.object({
        name: Joi.string()
             .required(),
        starRating: Joi.number()
            .min(0)
            .max(5)
            .required(),
        tags: Joi.array()
    });

    return schema.validate(business);
}

module.exports.Business = Business;
module.exports.validateBusiness = validateBusiness;
