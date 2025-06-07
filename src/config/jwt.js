require("dotenv").config();
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

function generateToken(user) {
    return jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        secret,
        { expiresIn: "21d" }
    );
};


function authenticateJWT(req, res, next) {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ error: 'Authentication token missing' });
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }

}


module.exports = {
    generateToken,
    authenticateJWT
}