const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
 
const userRoutes = require("./routes/userRoutes");
const depRoutes = require("./routes/DepRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const authRoutes = require("./routes/Authroutes");
const { protect } = require("./middleware/Authmiddleware");
 
const app = express();
 
// Middlewares
app.use(cors()); // مفتوح لأي دومين، عشان يشتغل مع أي رابط فرونت (زي Cloudflare Pages) من غير أي إعداد إضافي
app.use(express.json());
 
// Routes
app.use("/api/auth", authRoutes); // ده مش محمي، عشان تقدر تسجل دخول أصلاً
app.use("/api/users", protect, userRoutes);
app.use("/api/deps", protect, depRoutes);
app.use("/api/attendance", protect, attendanceRoutes);

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err.message);
    });

module.exports = app;
