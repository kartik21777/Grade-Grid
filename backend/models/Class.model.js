import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  originalId: { type: Number } // Used to maintain mapping during migration
}, { timestamps: true });

export default mongoose.model('Class', classSchema);
