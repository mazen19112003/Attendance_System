const Attendance = require("../models/Attendance");
const User = require("../models/User");

// سجل واحد بس لكل موظف/يوم -- لو مش موجود بيتعمل، لو موجود بيتحدث
async function upsertDayRecord(userId, day, fields) {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("الموظف ده مش موجود");
    err.status = 404;
    throw err;
  }

  const record = await Attendance.findOneAndUpdate(
    { user: user._id, day },
    {
      $set: {
        user: user._id,
        name: user.name,
        department: user.department || "",
        day,
        ...fields,
      },
    },
    { upsert: true, new: true }
  );

  return record;
}

// @desc    تسجيل ميعاد خروج موظف في يوم معين (يدوي)
// @route   POST /api/attendance/exit
// body: { userId, day, exitTime }
const setExit = async (req, res) => {
  try {
    const { userId, day, exitTime } = req.body;
    if (!userId || !day || !exitTime) {
      return res.status(400).json({
        success: false,
        message: "من فضلك اختار الموظف والتاريخ وميعاد الخروج",
      });
    }

    const record = await upsertDayRecord(userId, day, {
      exitTime: new Date(exitTime),
    });

    res.status(201).json({
      success: true,
      message: "تم تسجيل ميعاد الخروج",
      data: record,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.status ? error.message : "حصل خطأ في السيرفر",
      error: error.message,
    });
  }
};

// @desc    تسجيل ميعاد دخول موظف في يوم معين (يدوي)
// @route   POST /api/attendance/entry
// body: { userId, day, entryTime }
const setEntry = async (req, res) => {
  try {
    const { userId, day, entryTime } = req.body;
    if (!userId || !day || !entryTime) {
      return res.status(400).json({
        success: false,
        message: "من فضلك اختار الموظف والتاريخ وميعاد الدخول",
      });
    }

    const record = await upsertDayRecord(userId, day, {
      entryTime: new Date(entryTime),
    });

    res.status(201).json({
      success: true,
      message: "تم تسجيل ميعاد الدخول",
      data: record,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.status ? error.message : "حصل خطأ في السيرفر",
      error: error.message,
    });
  }
};

// @desc    إضافة/تحديث ملاحظة لموظف في يوم معين
// @route   POST /api/attendance/notes
// body: { userId, day, notes }
const setNotes = async (req, res) => {
  try {
    const { userId, day, notes } = req.body;
    if (!userId || !day) {
      return res.status(400).json({
        success: false,
        message: "من فضلك اختار الموظف والتاريخ",
      });
    }

    const record = await upsertDayRecord(userId, day, {
      notes: notes || "",
    });

    res.status(201).json({
      success: true,
      message: "تم حفظ الملاحظة",
      data: record,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.status ? error.message : "حصل خطأ في السيرفر",
      error: error.message,
    });
  }
};

// @desc    جلب آخر ميعاد خروج مسجل لموظف معين (يستخدم وقت الدخول)
// @route   GET /api/attendance/last/:userId
const getLastExit = async (req, res) => {
  try {
    const { userId } = req.params;

    const lastRecord = await Attendance.findOne({
      user: userId,
      exitTime: { $ne: null },
    }).sort({ exitTime: -1 });

    if (!lastRecord) {
      return res.status(200).json({
        success: true,
        message: "مفيش أي تسجيل خروج سابق للموظف ده",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: lastRecord,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "حصل خطأ في السيرفر",
      error: error.message,
    });
  }
};

// @desc    جلب كل السجلات المسجلة في يوم معين (للريبورت)
// @route   GET /api/attendance/day/:day  (day بصيغة YYYY-MM-DD)
const getByDay = async (req, res) => {
  try {
    const { day } = req.params;
    const records = await Attendance.find({ day }).sort({ name: 1 });

    // لكل سجل، بنجيب "آخر خروج سابق" ليه من يوم غير اليوم ده، عشان يتعرض في الريبورت
    const withPrevious = await Promise.all(
      records.map(async (r) => {
        const previous = await Attendance.findOne({
          user: r.user,
          day: { $ne: day },
          exitTime: { $ne: null },
        }).sort({ day: -1, exitTime: -1 });

        return {
          ...r.toObject(),
          previousExitTime: previous ? previous.exitTime : null,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: withPrevious.length,
      data: withPrevious,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "حصل خطأ في السيرفر",
      error: error.message,
    });
  }
};

// @desc    جلب كل السجلات
// @route   GET /api/attendance
const getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find().sort({ day: -1 });
    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "حصل خطأ في السيرفر",
      error: error.message,
    });
  }
};

module.exports = {
  setExit,
  setEntry,
  setNotes,
  getLastExit,
  getByDay,
  getAllAttendance,
};
