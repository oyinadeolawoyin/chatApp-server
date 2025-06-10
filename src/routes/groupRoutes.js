const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");
const { body } = require("express-validator");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const validateForm = [
  body("content")
    .trim()
    .escape(),
];


router.get("/", groupController.fetchGroups);
router.get("/allgroups", groupController.fetchAllGroup);
router.get("/:groupId", groupController.fetchGroup);
router.post("/new-group", groupController.createGroup);
router.post("/:groupId/member", groupController.newMember);
router.post("/:groupId/chat", upload.single("file"), validateForm, groupController.createChat);
router.get("/:groupId/chats", groupController.fetchChats);
router.delete("/:groupId/chats/:chatId", groupController.deleteChat);

module.exports = router;