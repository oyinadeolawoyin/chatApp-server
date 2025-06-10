const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const { body } = require("express-validator");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const validateForm = [
  body("content")
    .trim()
    .escape(),
];

router.get("/", contactController.fetchContacts);
router.get("/:contactId", contactController.fetchContact);
router.post("/new-contact", contactController.addToContact);
router.post("/:contactId/chat", upload.single("file"), validateForm, contactController.createChat);
router.get("/:contactId/chats", contactController.fetchChats);;
router.delete("/:contactId/chats/:chatId", contactController.deleteChat);
router.post("/:contactId/:status", contactController.blockContact);

module.exports = router;