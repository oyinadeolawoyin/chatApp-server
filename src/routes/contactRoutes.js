const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

router.get("/", contactController.fetchContacts);
router.post("/new-contact", contactController.addToContact);


module.exports = router;