const userService = require("../services/userService");
const { uploadFile } = require("./fileController");
const bcrypt = require("bcryptjs");

async function fetchUser(req, res) {
    try {
        const userId = Number(req.user.id);
        const user = await userService.fetchUser(userId);
        res.status(200).json({ user: user });
    } catch(error) {
        res.status(500).json({ message: error.message || "Something went wrong." });
    }
}

async function updateUser(req, res) {
    const { username, email, password, gender, country, bio } = req.body;
    const file = req.file;

    try {
        const userId = Number(req.user.id);
        let hashedPassword = null;
        
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        if (file) {
            const image = await uploadFile(file);
            const user = await userService.updateUser({ username, email, hashedPassword, gender, country, image, bio, userId });
            res.status(200).json({ user: user });
        } else {
            const user = await userService.updateUser({ username, email, hashedPassword, gender, bio, userId });
            res.status(200).json({ user: user });
        }
    } catch(error) {
        res.status(500).json({ message: error.message || "Something went wrong." });
    }
}


module.exports = {
    fetchUser,
    updateUser
}