const User = require("../models/User");

// @desc    إضافة يوزر جديد
// @route   POST /api/users
const addUser = async (req, res) => {
  try {
    const { name, department } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "من فضلك ادخل الاسم",
      });
    }

    const user = await User.create({ name, department });

    res.status(201).json({
      success: true,
      message: "تم إضافة اليوزر بنجاح",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "حصل خطأ في السيرفر",
      error: error.message,
    });
  }
};

// @desc    جلب كل اليوزرز
// @route   GET /api/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "حصل خطأ في السيرفر",
      error: error.message,
    });
  }
};

// @desc    تعديل بيانات يوزر
// @route   PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, department } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "من فضلك ادخل الاسم",
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { name, department },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "اليوزر ده مش موجود",
      });
    }

    res.status(200).json({
      success: true,
      message: "تم تعديل اليوزر بنجاح",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "حصل خطأ في السيرفر",
      error: error.message,
    });
  }
};

// @desc    حذف يوزر
// @route   DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "اليوزر ده مش موجود",
      });
    }

    res.status(200).json({
      success: true,
      message: "تم حذف اليوزر بنجاح",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "حصل خطأ في السيرفر",
      error: error.message,
    });
  }
};

module.exports = { addUser, getUsers, updateUser, deleteUser };