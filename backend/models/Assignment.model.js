import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  dueDate: { type: String, required: true },
  dueTime: { type: String, required: true },
  rubrics: {
    code: { type: Number, default: 25 },
    func: { type: Number, default: 50 },
    doc: { type: Number, default: 25 }
  },
  originalId: { type: Number } // Used to maintain mapping during migration
}, { timestamps: true });

export default mongoose.model('Assignment', assignmentSchema);
