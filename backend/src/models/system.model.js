import mongoose from "mongoose";

const systemSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  value: { type: mongoose.Schema.Types.Mixed },
});

export const System = mongoose.model("System", systemSchema);
