const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "الاسم مطلوب"],
      trim: true,
    },
        department: {
      type: String,
      required: [true, "القسم مطلوب"],
      trim: true,
    },
  },
  {
    timestamps: true, // بيضيف createdAt و updatedAt تلقائي
  }
);

module.exports = mongoose.model("User", userSchema);
