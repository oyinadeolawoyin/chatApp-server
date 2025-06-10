const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/", userController.fetchUser);
router.post("/update", upload.single("file"), userController.updateUser);

module.exports = router;