const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");

router.get("/", groupController.fetchGroups);
router.get("/:groupId", groupController.fetchGroup);
router.post("/new-group", groupController.createGroup);
router.post("/:groupId/member", groupController.newMember);


module.exports = router;