import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  file: { type: String, required: true },
  date: { type: String, default: () => new Date().toLocaleDateString() }
}, { timestamps: true });

export default mongoose.model('Note', noteSchema);
