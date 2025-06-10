const authService = require("../services/authService");
const contactService = require("../services/contactService");
const { validationResult } = require("express-validator");
const { uploadFile } = require("./fileController");

async function addToContact(req, res) {
    const { username } = req.body;
    try {
        const friend = await authService.findUserByUsername(username);
        if (!friend) return res.status(400).json({ message: "User not found" });
        const userId = Number(req.user.id);
        const newContact = await contactService.newContact({ username, userId });
        res.status(200).json({ newContact: newContact });
    } catch(error) {
        res.status(500).json({ message: error.message || "Something went wrong." });
    }
}

async function fetchContacts(req, res) {
    const userId = Number(req.user.id);
    try{
        const contacts = await contactService.fetchContacts(userId);
        res.status(200).json({ contacts: contacts });
    } catch(error) {
        res.status(500).json({ message: error.mesage || "Something went wrong." })
    }
}

async function fetchContact(req, res) {
    const { contactId } = req.params;
    try{
        const contact = await contactService.fetchContact(contactId);
        res.status(200).json({ contact: contact });
    } catch(error) {
        res.status(500).json({ message: error.message || "Something went wrong." })
    }
}

async function createChat(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
        message: errors.array()
        });
    }
    const { contactId } = req.params;
    const { content } = req.body;
    const file = req.file;
    try {
        const username = req.user.username;
        const userId = Number(req.user.id);

        if (file) {
            const image = await uploadFile(file);
            const chat = await contactService.createChat({ username, content, image, userId, contactId });
            res.status(200).json({ chat: chat });
        } else {
            const chat = await contactService.createChat({ username, content, userId, contactId });
            res.status(200).json({ chat: chat });
        }
    } catch(error) {
        res.status(500).json({ message: error.message || "Something is wrong." });
    }
}

async function fetchChats(req, res) {
    const { contactId } = req.params;
    try {
        const chats = await contactService.fetchChats(contactId);
        res.status(200).json({ chats: chats });
    } catch(error) {
        res.status(500).json({ message: error.message || "Something is wrong." });
    }
}

async function deleteChat(req, res) {
    const { chatId } = req.params;
    try {
        await contactService.deleteChat(chatId);
        res.status(200).json({ message: "Message delete successfully." });
    } catch(error) {
        res.status(500).json({ message: error.message || "Something is wrong." });
    }
}

async function blockContact(req, res) {
    const { contactId, status } = req.params;
    try {
        await contactService.blockContact({ contactId, status });
        res.status(200).json({ message: "Succesfully!"});
    } catch(error) {
        res.status(500).json({ message: error.message || "Something went wrong." });
    }
}

module.exports = {
    addToContact,
    fetchContacts,
    fetchContact,
    createChat,
    fetchChats,
    deleteChat,
    blockContact
}