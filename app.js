const express = require("express");
require("dotenv").config();
const app = express();
const { authenticateJWT } = require('./src/config/jwt');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const multer = require("multer");

const authRoutes = require("./src/routes/authRoutes");
const contactRoutes = require("./src/routes/contactRoutes");
const groupRoutes = require("./src/routes/groupRoutes");
const userRoutes = require("./src/routes/userRoutes");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
  
app.use(cors({
  origin: ["http://localhost:5173", "https://chatapp-server-aa0t.onrender.com"], // Allow both local and deployed frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));
  
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/contacts", authenticateJWT, contactRoutes);
app.use("/api/groups", authenticateJWT, groupRoutes);
app.use("/api/users", authenticateJWT, userRoutes);

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError || err.message === "Unsupported file type") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));