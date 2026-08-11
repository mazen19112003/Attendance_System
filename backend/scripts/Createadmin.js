// سكريبت بيتشغل مرة واحدة بس عشان تعمل يوزر الأدمن بتاعك
// استخدام: node scripts/createAdmin.js <username> <password>

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

const [, , username, password] = process.argv;

if (!username || !password) {
  console.log("استخدام: node scripts/createAdmin.js <username> <password>");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const existing = await Admin.findOne({ username });
    if (existing) {
      console.log("اليوزر ده موجود بالفعل، هنغير الباسورد بتاعه.");
      const hashed = await bcrypt.hash(password, 10);
      existing.password = hashed;
      await existing.save();
      console.log("تم تحديث الباسورد بنجاح.");
    } else {
      const hashed = await bcrypt.hash(password, 10);
      await Admin.create({ username, password: hashed });
      console.log("تم إنشاء يوزر الأدمن بنجاح.");
    }
    process.exit(0);
  })
  .catch((err) => {
    console.error("حصل خطأ:", err.message);
    process.exit(1);
  });