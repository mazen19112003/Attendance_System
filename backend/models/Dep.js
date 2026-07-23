const mongoose = require("mongoose");

const DepSchema = new mongoose.Schema(
  {
        Depname: {
      type: String,
      required: [true, "القسم مطلوب"],
      trim: true,
    },
  },
  {
    timestamps: true, // بيضيف createdAt و updatedAt تلقائي
  }
);

module.exports = mongoose.model("Dep", DepSchema);
