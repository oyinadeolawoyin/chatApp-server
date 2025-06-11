const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const { body } = require("express-validator");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const validateForm = [
  body("content")
    .trim()
];

router.get("/", contactController.fetchContacts);
router.get("/:contactId", contactController.fetchContact);
router.post("/new-contact", contactController.addToContact);
router.post("/:contactId/chat", upload.single("file"), validateForm, contactController.createChat);
router.delete("/:contactId/chats/:chatId", contactController.deleteChat);
router.post("/:contactId/chats/:chatId/liked/:username", contactController.likeChat);
router.post("/:contactId/:status", contactController.blockContact);

module.exports = router;