import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Class from '../models/Class.model.js';
import Student from '../models/Student.model.js';
import Assignment from '../models/Assignment.model.js';
import Score from '../models/Score.model.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/grade';

const migrate = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected for migration...');

    let classesData, studentsData, assignmentsData, submissionsData;

    try {
      const jsonPath = path.join(__dirname, '../../src/data/mockData.json');
      const fileData = await fs.readFile(jsonPath, 'utf8');
      const parsedData = JSON.parse(fileData);
      classesData = parsedData.CLASSES || [];
      studentsData = parsedData.STUDENTS || [];
      assignmentsData = parsedData.ASSIGNMENTS || [];
      submissionsData = parsedData.SUBMISSIONS || [];
      console.log('Successfully loaded data from mockData.json');
    } catch (err) {
      console.log('mockData.json not found or could not be parsed, falling back to importing mockData.js...');
      const mockData = await import('../../src/data/mockData.js');
      classesData = mockData.CLASSES;
      studentsData = mockData.STUDENTS;
      assignmentsData = mockData.ASSIGNMENTS;
      submissionsData = mockData.SUBMISSIONS;
    }

    // 1. Migrate Classes
    console.log('Migrating classes...');
    const classIdMap = {}; 
    for (const cls of classesData) {
      if (!cls.name) {
         console.warn(`Class missing name: ${JSON.stringify(cls)}`);
         continue;
      }
      const updatedClass = await Class.findOneAndUpdate(
        { originalId: cls.id },
        { name: cls.name, originalId: cls.id },
        { upsert: true, new: true }
      );
      classIdMap[cls.id] = updatedClass._id;
    }

    // 2. Migrate Students
    console.log('Migrating students...');
    const studentIdMap = {};
    for (const stu of studentsData) {
      if (!stu.rollNo || !stu.name) {
         console.warn(`Student missing required fields: ${JSON.stringify(stu)}`);
         continue;
      }
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
    }

    // 3. Migrate Assignments
    console.log('Migrating assignments...');
    const assignmentIdMap = {};
    for (const assign of assignmentsData) {
      if (!assign.title || !assign.dueDate) {
         console.warn(`Assignment missing required fields: ${JSON.stringify(assign)}`);
         continue;
      }
      const updatedAssignment = await Assignment.findOneAndUpdate(
        { originalId: assign.id },
        {
          title: assign.title,
          subject: assign.subject,
          classId: classIdMap[assign.classId] || null,
          dueDate: assign.dueDate,
          dueTime: assign.dueTime || '23:59',
          originalId: assign.id,
          rubrics: assign.rubrics || { code: 25, func: 50, doc: 25 }
        },
        { upsert: true, new: true }
      );
      assignmentIdMap[assign.id] = updatedAssignment._id;
    }

    // 4. Migrate Submissions (Scores)
    console.log('Migrating scores...');
    let scoresMigrated = 0;
    for (const sub of submissionsData) {
      if (!studentIdMap[sub.studentId] || !assignmentIdMap[sub.assignmentId]) {
         console.warn(`Skipping submission - missing mapped student or assignment: ${JSON.stringify(sub)}`);
         continue;
      }
      
      await Score.findOneAndUpdate(
        { 
          studentId: studentIdMap[sub.studentId], 
          assignmentId: assignmentIdMap[sub.assignmentId] 
        },
        {
          studentId: studentIdMap[sub.studentId],
          assignmentId: assignmentIdMap[sub.assignmentId],
          status: sub.status,
          file: sub.file,
          graded: sub.graded,
          score: sub.score,
          submissionDate: sub.submissionDate || new Date().toISOString().split('T')[0]
        },
        { upsert: true, new: true }
      );
      scoresMigrated++;
    }

    console.log(`Migration completed successfully! Processed ${scoresMigrated} scores.`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
