import mongoose from 'mongoose';

const SummarySchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true
    },
    summary: {
      type: String,
      required: true,
      trim: true
    },
    originalLength: {
      type: Number,
      required: true
    },
    summaryLength: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Summary = mongoose.models.Summary || mongoose.model('Summary', SummarySchema);
export default Summary;
