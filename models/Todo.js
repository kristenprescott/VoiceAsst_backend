const { Schema, model } = require("mongoose");

const todoSchema = new Schema({
  task: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  done: { type: Boolean, default: false },
});

module.exports = model("Todo", todoSchema);
