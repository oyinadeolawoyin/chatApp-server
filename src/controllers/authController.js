require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("../config/jwt");
const authService = require("../services/authService");
const { validationResult } = require("express-validator");
const { uploadFile } = require("./fileController");

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    maxAge: 1000 * 60 * 60 * 24 * 21,
};
  
async function signup(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
        message: errors.array()
        });
    }

    const { username, password, email, country, gender, bio } = req.body;
    const file = req.file;
    try {
        const existingUser = await authService.findUserByEmail(email);
        if (existingUser) return res.status(400).json({ message: "User already exists"});

        const hashedPassword = await bcrypt.hash(password, 10);

        if (file) {
            const image = await uploadFile(file);
            const user = await authService.createUser({
                username,
                password: hashedPassword, 
                email, 
                country, 
                gender, 
                image,
                bio
            });
            const token = jwt.generateToken(user); 
            res.cookie("token", token, cookieOptions).status(200).json({ token: token });
        } else {
            const user = await authService.createUser({
                username,
                password: hashedPassword, 
                email, 
                country, 
                gender, 
                bio
            });
            const token = jwt.generateToken(user); 
            res.cookie("token", token, cookieOptions).status(200).json({ token: token });
        }
    } catch (error) {
        res.status(500).json({ error: error.message || "Something went wrong" });
    }
};

async function login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
        message: errors.array()
        });
    }

    const { username, password } = req.body;

    try {
        const user = await authService.findUserByUsername(username);
        if (!user) return res.status(400).json({ message: "User not found" });
        
        const valid = await bcrypt.compare(password, user.password);
       
        if(!valid) return res.status(401).json({ error: "Invalid password" });

        const token = jwt.generateToken(user);

        res.cookie("token", token, cookieOptions).status(200).json({ token: token });
    } catch (error) {
        res.status(500).json({ error: error.message || "Login error." });
    }
};

function logout(req, res) {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
}


async function getMe(req, res) {
    try {
        const user = req.user;
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user" });
    }
}




module.exports = {
    signup,
    login,
    logout,
    getMe
};