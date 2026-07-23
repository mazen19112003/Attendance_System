const express = require("express");
const router = express.Router();
const { addDep, getDep } = require("../controllers/Depcontroller");

router.post("/", addDep); // إضافة يوزر
router.get("/", getDep); // جلب كل اليوزرز

module.exports = router;
