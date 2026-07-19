// src/models/Entry.js
import mongoose from 'mongoose';

if (mongoose.models.Entry) {
  delete mongoose.models.Entry;
}

const EntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    operatorName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: false, // Changed to false to prevent database validation blockages
      default: 'Unknown Operator'
    },
    clientName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phoneNo: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    currentEndDate: { type: Date, required: true },
    extensionDays: { type: Number, required: true, min: 0, default: 0 },
    newEndDate: { type: Date, required: true },
    finalReportDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Entry || mongoose.model('Entry', EntrySchema);