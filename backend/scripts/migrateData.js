import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Class from '../models/Class.model.js';
import Student from '../models/Student.model.js';
import Assignment from '../models/Assignment.model.js';
import Score from '../models/Score.model.js';
import Note from '../models/Note.model.js';
import User from '../models/User.model.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/grade';

// ---- Seed Data (previously in mockData.js) ----

const SEED_USERS = [
  { userId: 'admin1', password: 'admin', role: 'admin' },
  { userId: '101', password: 'password123', role: 'teacher' },
  { userId: '102', password: 'password123', role: 'teacher' },
  { userId: 'CS-101', password: 'password123', role: 'student' },
  { userId: 'CS-102', password: 'password123', role: 'student' },
  { userId: 'CS-103', password: 'password123', role: 'student' },
  { userId: 'CS-104', password: 'password123', role: 'student' },
  { userId: 'CS-105', password: 'password123', role: 'student' },
  { userId: 'CS-106', password: 'password123', role: 'student' },
  { userId: 'CS-107', password: 'password123', role: 'student' },
  { userId: 'CS-108', password: 'password123', role: 'student' },
  { userId: 'CS-109', password: 'password123', role: 'student' },
  { userId: 'CS-110', password: 'password123', role: 'student' },
  { userId: 'IT-201', password: 'password123', role: 'student' },
  { userId: 'IT-202', password: 'password123', role: 'student' },
];

const SEED_CLASSES = [
  { id: 1, name: 'Year 2 - CSE A' },
  { id: 2, name: 'Year 3 - IT A' },
  { id: 3, name: 'Year 1 - CSE B' }
];

const SEED_STUDENTS = [
  { id: 'S1', rollNo: 'CS-101', name: 'Alice Smith', classId: 1 },
  { id: 'S2', rollNo: 'CS-102', name: 'Bob Jones', classId: 1 },
  { id: 'S8', rollNo: 'CS-106', name: 'David Kim', classId: 1 },
  { id: 'S9', rollNo: 'CS-107', name: 'Emma Watson', classId: 1 },
  { id: 'S10', rollNo: 'CS-108', name: 'Frank Castle', classId: 1 },
  { id: 'S11', rollNo: 'CS-109', name: 'Grace Hopper', classId: 1 },
  { id: 'S12', rollNo: 'CS-110', name: 'Henry Ford', classId: 1 },
  { id: 'S3', rollNo: 'IT-201', name: 'Charlie Brown', classId: 2 },
  { id: 'S4', rollNo: 'IT-202', name: 'Diana Prince', classId: 2 },
  { id: 'S5', rollNo: 'CS-103', name: 'Evan Wright', classId: 3 },
  { id: 'S6', rollNo: 'CS-104', name: 'Fiona Gallagher', classId: 3 },
  { id: 'S7', rollNo: 'CS-105', name: 'George Miller', classId: 3 }
];

const SEED_NOTES = [
  { id: 1, title: 'Introduction to Trees', subject: 'Data Structures', classId: 1, file: 'trees_intro.pdf' },
  { id: 2, title: 'Complexity Analysis Cheat Sheet', subject: 'Algorithms', classId: 1, file: 'complexity.pdf' },
  { id: 3, title: 'React Hooks Overview', subject: 'Web Development', classId: 2, file: 'hooks.pdf' }
];

// ASSIGNMENTS and SUBMISSIONS arrays were empty in mockData.js, so no seed data needed for those.

const migrate = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected for migration...');

    // 1. Migrate Classes
    console.log('\n--- Step 1: Migrating Classes ---');
    const classIdMap = {}; 
    for (const cls of SEED_CLASSES) {
      const updatedClass = await Class.findOneAndUpdate(
        { originalId: cls.id },
        { name: cls.name, originalId: cls.id },
        { upsert: true, new: true }
      );
      classIdMap[cls.id] = updatedClass._id;
      console.log(`  ✓ Class "${cls.name}" (originalId: ${cls.id})`);
    }

    // 2. Migrate Students
    console.log('\n--- Step 2: Migrating Students ---');
    const studentIdMap = {};
    for (const stu of SEED_STUDENTS) {
      const updatedStudent = await Student.findOneAndUpdate(
        { rollNo: stu.rollNo },
        {
          rollNo: stu.rollNo,
          name: stu.name,
          classId: classIdMap[stu.classId] || null,
          originalId: stu.id
        },
        { upsert: true, new: true }
      );
      studentIdMap[stu.id] = updatedStudent._id;
      console.log(`  ✓ Student "${stu.name}" (${stu.rollNo})`);
    }

    // 3. Migrate Users (Credentials)
    console.log('\n--- Step 3: Migrating Users ---');
    for (const user of SEED_USERS) {
      await User.findOneAndUpdate(
        { userId: user.userId },
        { userId: user.userId, password: user.password, role: user.role },
        { upsert: true, new: true }
      );
      console.log(`  ✓ User "${user.userId}" (${user.role})`);
    }

    // 4. Migrate Notes
    console.log('\n--- Step 4: Migrating Notes ---');
    for (const note of SEED_NOTES) {
      await Note.findOneAndUpdate(
        { title: note.title, subject: note.subject },
        {
          title: note.title,
          subject: note.subject,
          classId: classIdMap[note.classId] || null,
          file: note.file,
          date: new Date().toLocaleDateString('en-GB')
        },
        { upsert: true, new: true }
      );
      console.log(`  ✓ Note "${note.title}" (${note.subject})`);
    }

    console.log('\n=== Migration completed successfully! ===');
    console.log(`  Classes: ${SEED_CLASSES.length}`);
    console.log(`  Students: ${SEED_STUDENTS.length}`);
    console.log(`  Users: ${SEED_USERS.length}`);
    console.log(`  Notes: ${SEED_NOTES.length}`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
