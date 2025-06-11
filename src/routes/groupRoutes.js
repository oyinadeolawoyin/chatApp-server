const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");
const { body } = require("express-validator");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const validateForm = [
  body("content")
    .trim()
];


router.get("/", groupController.fetchGroups);
router.get("/allgroups", groupController.fetchAllGroup);
router.get("/:groupId", groupController.fetchGroup);
router.post("/new-group", groupController.createGroup);
router.post("/:groupId/member", groupController.newMember);
router.post("/:groupId/chat", upload.single("file"), validateForm, groupController.createChat);
router.delete("/:groupId/chats/:chatId", groupController.deleteChat);
router.post("/:groupId/chats/:chatId/liked/:username", groupController.likeChat);

module.exports = router;