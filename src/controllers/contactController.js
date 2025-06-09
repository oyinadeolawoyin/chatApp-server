const authService = require("../services/authService");
const contactService = require("../services/contactService");

async function addToContact(req, res) {
    const { username } = req.body;

    try {
        const friend = await authService.findUserByUsername(username);
        if (!friend) return res.status(400).json({ message: "User not found" });
        
        const userId = Number(req.user.id);
        const newContact = await contactService.newContact({ username, userId });
        console.log("newc", newContact);
        res.status(200).json({ newContact: newContact });
    } catch(error) {
        res.status(500).json({ message: error.message || "Something went wrong." });
    }
}

async function fetchContacts(req, res) {
    const userId = Number(req.user.id);
    console.log("user", userId);

    try{
        const contacts = await contactService.fetchContacts(userId);
        console.log("cont", contacts);
        res.status(200).json({ contacts: contacts });
    } catch(error) {
        res.status(500).json({ message: error.mesage || "Something went wrong." })
    }
   

}

module.exports = {
    addToContact,
    fetchContacts
}