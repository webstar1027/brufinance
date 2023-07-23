const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/login", authController.login);
router.post("/google-signin", authController.googleSignIn);
router.post("/facebook-signin", authController.facebookSignIn);

router.post("/logout", authController.logout);

// router.use(authController.protect);

router.get("/profile", authController.getProfile);

module.exports = router;
