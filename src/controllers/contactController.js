const authService = require("../services/authService");
const contactService = require("../services/contactService");
const { validationResult } = require("express-validator");
const { uploadFile } = require("./fileController");
const userService = require("../services/userService");

async function addToContact(req, res) {
    const { username } = req.body;
    const user = req.user.username;
    try {
        const friend = await authService.findUserByUsername(username);
        if (!friend) return res.status(400).json({ message: "User not found" });

        const friendId = friend.id;
        const userId = Number(req.user.id);

        const newContact = await contactService.newContact({ username, userId });

        await contactService.newContact({ 
            username: user,
            userId: friendId
        });

        res.status(200).json({ newContact: newContact });
    } catch (error) {
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
        const user = req.user.username;
        const action = "message";
        const userId = Number(req.user.id);

        let image = null;
        if (file) {
            image = await uploadFile(file);
        }

        const contact = await contactService.fetchContact(contactId);
        const friendName = contact.friendName;
        const friend = await authService.findUserByUsername(friendName);
        const friendId = friend.id;
        const friendContact = friend.contacts.find(contact => contact.friendName === username);

        const chat = await contactService.createChat({
            username,
            content,
            image,
            contacts: [contactId, friendContact.id],
            users: [userId, friend.id]
        });

        await userService.notification({ user, friendId, action });

        res.status(200).json({ chat: chat });
    } catch (error) {
        res.status(500).json({ message: error.message || "Something went wrong." });
    }
}

async function deleteChat(req, res) {
    const { chatId } = req.params;
    try {
        await contactService.deleteChat(chatId);
        res.status(200).json({ message: "Message delete successfully." });
    } catch(error) {
        res.status(500).json({ message: error.message || "Something went wrong." });
    }
}

async function likeChat(req, res) {
    const { chatId, username } = req.params;
    const userId = req.user.id;

    const friend = await authService.findUserByUsername(username);
    const friendId = Number(friend.id);
    const user = req.user.username;
    const action = "liked";

    try {
        const like = await contactService.likeChat(chatId, userId);
        await userService.notification({ user, friendId, action });
        res.status(200).json({ like: like });
    } catch(error) {
        res.status(500).json({ message: error.message || "Something went wrong." })
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
    deleteChat,
    likeChat,
    blockContact
}