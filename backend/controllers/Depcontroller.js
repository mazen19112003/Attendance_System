const Dep = require("../models/Dep");

// @desc    إضافة Dep جديد
// @route   POST /api/users
const addDep = async (req, res) => {
  try {
    const {  Depname } = req.body;

    // تحقق ان كل الحقول المطلوبة موجودة
    if ( ! Depname) {
      return res.status(400).json({
        success: false,
        message: "من فضلك ادخل القسم ",
      });
    }

    // // تحقق ان اليوزر مش موجود قبل كده بنفس الايميل
    // const userExists = await User.findOne({ email });
    // if (userExists) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "الايميل ده مستخدم بالفعل",
    //   });
    // }

    
    // إنشاء اليوزر
    const dep = await Dep.create({
      Depname
    });

    res.status(201).json({
      success: true,
      message: "تم إضافة اليوزر بنجاح",
    //   data: {
    //     id: user._id,
    //     Depname  : user.Dep
    //   },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "حصل خطأ في السيرفر",
      error: error.message,
    });
  }
};

const getDep = async (req, res) => {
  try {
    const Deps = await Dep.find().select("-password");
    res.status(200).json({
      success: true,
      count: Dep.length,
      data: Deps,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "حصل خطأ في السيرفر",
      error: error.message,
    });
  }
};

module.exports = { addDep, getDep };
