import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  dueDate: { type: String, required: true },
  dueTime: { type: String, required: true },
  rubrics: { 
    type: mongoose.Schema.Types.Mixed, 
    default: () => ({ code: 25, func: 50, doc: 25 }) 
  },
  file: { type: String },
  originalId: { type: Number } // Used to maintain mapping during migration
}, { timestamps: true });

export default mongoose.model('Assignment', assignmentSchema);
