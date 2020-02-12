const express = require("express");
const router = express.Router();
const UserController = require("../controllers/users-controller");
const checkAuth = require("../middleware/check-auth");

router.get("/:userId", checkAuth, (req, res) => {
  UserController.getUser(req, res);
});

router.post("/signup", (req, res) => {
  UserController.createUser(req, res);
});

router.post("/login", async (req, res) => {
  UserController.loginUser(req, res);
});

// TODO: Right now, a logged in user could delete any other logged
// in user. Instead, use req.userData from checkAuth
router.delete("/:userId", checkAuth, (req, res) => {
  UserController.deleteUser(req, res);
});

module.exports = router;
