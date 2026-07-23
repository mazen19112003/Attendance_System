const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const DepRoutes = require("./routes/DepRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/deps", DepRoutes);
app.use("/api/attendance", attendanceRoutes);
// الاتصال بقاعدة البيانات وتشغيل السيرفر
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("تم الاتصال بقاعدة البيانات بنجاح");
    app.listen(PORT, () => {
      console.log(`السيرفر شغال على البورت ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("فشل الاتصال بقاعدة البيانات:", err.message);
  });
