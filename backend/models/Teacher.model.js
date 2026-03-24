import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  empId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  dept: { type: String, required: true },
  assignedClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
  originalId: { type: String } // Used to maintain mapping during migration (e.g., 'T1')
}, { timestamps: true });

export default mongoose.model('Teacher', teacherSchema);
