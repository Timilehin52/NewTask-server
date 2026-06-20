const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      enum: ["urgent", "important", "normal"],
      default: "normal",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
