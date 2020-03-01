const { Business, validateBusiness } = require("../models/business");

getBusinesses = async (req, res) => {
    try {
        const businesses = await Business.find({})
            .populate("tags")
            .populate("reviews")
        if (businesses.length === 0)
            return res.status(404).send({ err: "No Businesses found" });
        return res.status(200).send({ businesses });
    } catch (err) {
        return res.status(500).send({ err });
    }
};

getBusinessById = async (req, res) => {
    try {
        const business = await Business.findById(req.params.id)
            .populate("tags")
            .populate("reviews");
        if (!business) return res.status(404).send({ err: "Business not found" });
        return res.status(200).send({ business });
    } catch (err) {
        return res.status(500).send({ err });
    }
};

getBusinessesWithinRaidus = async (req, res) => {
    var milesToRadian = function (miles) {
        var earthRadiusInMiles = 3959;
        return miles / earthRadiusInMiles;
    };

    const long = req.query.long;
    const lat = req.query.lat;
    const miles = req.query.miles;

    try {
        
        var query = {
            "location":
            {
                $geoWithin: {
                    $centerSphere: [[long, lat], milesToRadian(miles)]
                }
            }
        }

        const businesses = await Business.find(query)
            .populate("tags")
            .populate("reviews");

        if (businesses.length === 0)
            return res.status(404).send({ err: "No Businesses found" });

        return res.status(200).send( { businesses } )
    } catch (err) {
        return res.status(500).send({ err });
    }
};

createBusiness = async (req, res) => {

    const business = new Business({
        name: req.body.name,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        postal_code: req.body.postal_code,
        location: {
            type: "Point",
            coordinates: [req.body.long, req.body.lat]
        }
    });

    try {
        await business.save();

        return res.status(201).send({
            business,
            message: "Business successfully created!"
        });
    } catch (err) {
        return res.status(500).send({ err });
    }
};


module.exports = {
    getBusinesses,
    getBusinessById,
    getBusinessesWithinRaidus,
    createBusiness
};
