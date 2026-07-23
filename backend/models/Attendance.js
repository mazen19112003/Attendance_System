const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      // بنسجلها هنا كمان عشان تفضل واضحة حتى لو اليوزر اتمسح بعدين
      type: String,
      required: true,
    },
    department: {
      // بنسجلها هنا كمان عشان القسم وقتها يفضل واضح في الريبورت حتى لو اتغير بعدين
      type: String,
      default: "",
    },
    day: {
      // اليوم اللي السجل ده تابع له، بصيغة YYYY-MM-DD
      type: String,
      required: true,
    },
    exitTime: {
      type: Date,
      default: null,
    },
    entryTime: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// سجل واحد بس لكل موظف في كل يوم
attendanceSchema.index({ user: 1, day: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
