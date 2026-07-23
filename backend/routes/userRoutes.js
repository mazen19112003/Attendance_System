const express = require("express");
const router = express.Router();
const { addUser, getUsers, updateUser, deleteUser } = require("../controllers/userController");
 
router.post("/", addUser); // إضافة يوزر
router.get("/", getUsers); // جلب كل اليوزرز
router.put("/:id", updateUser); // تعديل يوزر
router.delete("/:id", deleteUser); // حذف يوزر
 
module.exports = router;