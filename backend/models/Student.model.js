import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  rollNo: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  originalId: { type: String } // Used to maintain mapping during migration
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);
