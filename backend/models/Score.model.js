import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  status: { type: String, enum: ['Pending', 'Submitted'], default: 'Pending' },
  file: { type: String },
  graded: { type: Boolean, default: false },
  score: { type: mongoose.Schema.Types.Mixed },
  feedback: { type: String },
  submissionDate: { type: String }
}, { timestamps: true });

// Prevent duplicate submission per student per assignment natively on the DB level
scoreSchema.index({ studentId: 1, assignmentId: 1 }, { unique: true });

export default mongoose.model('Score', scoreSchema);
