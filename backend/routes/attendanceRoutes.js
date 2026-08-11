const express = require("express");
const router = express.Router();
const {
  setExit,
  setEntry,
  setNotes,
  getLastExit,
  getByDay,
  getAllAttendance,
  deleteRecord,
  deleteByUserDay,
} = require("../controllers/attendanceController");

router.post("/exit", setExit); // تسجيل خروج
router.post("/entry", setEntry); // تسجيل دخول
router.post("/notes", setNotes); // إضافة/تعديل ملاحظة
router.get("/last/:userId", getLastExit); // آخر خروج لموظف معين
router.get("/day/:day", getByDay); // كل سجلات يوم معين (للريبورت)
router.get("/", getAllAttendance); // كل السجلات
router.delete("/user/:userId/day/:day", deleteByUserDay); // حذف سجل بالموظف والتاريخ
router.delete("/:id", deleteRecord); // حذف سجل بالـ id

module.exports = router;

// وفي server.js لازم يكون عندك:
// const attendanceRoutes = require("./routes/attendanceRoutes");
// app.use("/api/attendance", attendanceRoutes);