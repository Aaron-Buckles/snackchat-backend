const express = require("express");
const router = express.Router();
const BusinessController = require("../controllers/business-controller");
const checkAuth = require("../middleware/check-auth");

const skipIfQuery = function (middleware) {
    return function (req, res, next) {
        console.log(req.query)
        if (req.query.long) return next();
        return middleware(req, res, next);
    };
};

router.get("/", skipIfQuery(BusinessController.getBusinesses), BusinessController.getBusinessesWithinRaidus);
router.get("/:id", BusinessController.getBusinessById);
router.post("/", BusinessController.createBusiness);

module.exports = router;
