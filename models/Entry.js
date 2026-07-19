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
    // New field added to log the operator full name to the record
    username: {
      type: String,
      required: true,
    },
    // Client Information
    clientName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phoneNo: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    // Timeline Details
    currentEndDate: { type: Date, required: true },
    extensionDays: { type: Number, required: true, min: 0 },
    newEndDate: { type: Date, required: true },
    finalReportDate: { type: Date, required: true }, // Added field
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Entry || mongoose.model('Entry', EntrySchema);