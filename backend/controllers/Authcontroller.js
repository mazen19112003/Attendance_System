const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// @desc    تسجيل دخول الأدمن
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "من فضلك ادخل اليوزر نيم والباسورد",
      });
    }
console.log(4);

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "اليوزر نيم أو الباسورد غلط",
      });
    }
console.log(1);

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "اليوزر نيم أو الباسورد غلط",
      });
    }
console.log(2);

    const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
console.log(3);

    res.status(200).json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
      data: { token, username: admin.username },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "حصل خطأ في السيرفر",
      error: error.message,
    });
  }
};

module.exports = { login };