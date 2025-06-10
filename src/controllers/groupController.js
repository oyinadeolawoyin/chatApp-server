const groupService = require("../services/groupService");
const { validationResult } = require("express-validator");
const { uploadFile } = require("./fileController");

async function createGroup(req, res) {
    const { groupname } = req.body;

    try { 
        const userId = Number(req.user.id);
        const newgroup = await groupService.createGroup({ groupname, userId });
        res.status(200).json({ group: newgroup });
    } catch(error) {
        res.status(500).json({ message: error.message || "Something went wrong." });
    }
}

async function fetchAllGroup(req, res) {
    try {
        const groups = await groupService.fetchAllGroup();
        res.status(200).json({ groups: groups });
    } catch(error) {
        res.status(500).json({ message: error.message || "Something went wrong." });
    }
}

async function fetchGroups(req, res) {
    try{
        const userId = Number(req.user.id);
        const groups = await groupService.fetchGroups(userId);
        res.status(200).json({ groups: groups });
    } catch(error) {
        res.status(500).json({ message: error.message || "Something went wrong." })
    }
}

async function fetchGroup(req, res) {
    const { groupId } = req.params;
    try{
        const group = await groupService.fetchGroup(groupId);
        res.status(200).json({ group: group });
    } catch(error) {
        res.status(500).json({ message: error.message || "Something went wrong." })
    }
}

async function newMember(req, res) {
    const { groupId } = req.params;
    try{
        const userId = Number(req.user.id);
        const membername = req.user.username;
        const newMember = await groupService.newMember({ membername, userId, groupId });
        res.status(200).json({ member: newMember });
    } catch(error) {
        res.status(500).json({ message: error.message || "Something went wrong." });
    }
}

async function createChat(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
        message: errors.array()
        });
    }

    const { groupId } = req.params;
    const { content } = req.body;
    const file = req.file;
    try {
        const username = req.user.username;
        const userId = Number(req.user.id);
        if (file) {
            const image = await uploadFile(file);
            const chat = await groupService.createChat({ username, content, image, userId, groupId });
            res.status(200).json({ chat: chat });
        } else {
            const chat = await groupService.createChat({ username, content, userId, groupId });
            res.status(200).json({ chat: chat });
        }
    } catch(error) {
        res.status(500).json({ message: error.message || "Something is wrong." });
    }
}

async function fetchChats(req, res) {
    const { groupId } = req.params;
    try {
        const chats = await groupService.fetchChats(groupId);
        res.status(200).json({ chats: chats });
    } catch(error) {
        res.status(500).json({ message: error.message || "Something is wrong." });
    }
}

async function deleteChat(req, res) {
    const { chatId } = req.params;
    try {
        await groupService.deleteChat(chatId);
        res.status(200).json({ message: "Message delete successfully." });
    } catch(error) {
        res.status(500).json({ message: error.message || "Something is wrong." });
    }
}

module.exports = {
    createGroup,
    fetchAllGroup,
    fetchGroups,
    fetchGroup,
    newMember,
    createChat,
    fetchChats,
    deleteChat
}