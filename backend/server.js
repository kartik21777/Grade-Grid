import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Models
import Class from './models/Class.model.js';
import Student from './models/Student.model.js';
import Assignment from './models/Assignment.model.js';
import Score from './models/Score.model.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Setup file uploads
const assignmentsDir = path.join(__dirname, 'uploads', 'assignments');
const submissionsDir = path.join(__dirname, 'uploads', 'submissions');

if (!fs.existsSync(assignmentsDir)) fs.mkdirSync(assignmentsDir, { recursive: true });
if (!fs.existsSync(submissionsDir)) fs.mkdirSync(submissionsDir, { recursive: true });

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.originalUrl.includes('/api/assignments')) {
      cb(null, assignmentsDir);
    } else {
      cb(null, submissionsDir);
    }
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    if (req.originalUrl.includes('/api/assignments')) {
      cb(null, `${Date.now()}-${cleanName}`);
    } else {
      const { studentId, assignmentId } = req.params;
      cb(null, `${assignmentId}_${studentId}_${cleanName}`);
    }
  }
});
const upload = multer({ storage });

// Connect to DB
connectDB();

// 1. GET /api/data - Fetch all initial data using Promise.all
app.get('/api/data', async (req, res) => {
  try {
    const [classes, students, assignments, scores] = await Promise.all([
      Class.find({}).lean(),
      Student.find({}).lean(),
      Assignment.find({}).lean(),
      Score.find({}).populate('studentId', 'name originalId').lean()
    ]);

    const mappedClasses = classes.map(c => ({
      ...c,
      id: c.originalId ? c.originalId.toString() : c._id.toString(),
      _id: c._id.toString()
    }));

    const mappedStudents = students.map(s => {
      const cls = classes.find(c => c._id.toString() === s.classId?.toString());
      return {
        ...s,
        id: s.originalId ? s.originalId.toString() : s._id.toString(),
        _id: s._id.toString(),
        classId: cls ? (cls.originalId ? cls.originalId.toString() : cls._id.toString()) : null
      };
    });

    const mappedAssignments = assignments.map(a => {
      const cls = classes.find(c => c._id.toString() === a.classId?.toString());
      return {
        ...a,
        id: a.originalId ? a.originalId.toString() : a._id.toString(),
        _id: a._id.toString(),
        classId: cls ? (cls.originalId ? cls.originalId.toString() : cls._id.toString()) : null,
        file: a.file || null
      };
    });

    const mappedSubmissions = scores.map(s => {
      const assignment = assignments.find(a => a._id.toString() === s.assignmentId?.toString());
      
      // Populate may not resolve if studentId was stored as a plain string (legacy data)
      // so we fall back to manual lookup in the students array
      let resolvedStudentId = null;
      let resolvedStudentName = 'Unknown';
      if (s.studentId && typeof s.studentId === 'object') {
        // Populated successfully
        resolvedStudentId = s.studentId.originalId ? s.studentId.originalId.toString() : s.studentId._id.toString();
        resolvedStudentName = s.studentId.name;
      } else if (s.studentId) {
        // Plain string/ObjectId - look up manually
        const foundStudent = students.find(st => st._id.toString() === s.studentId.toString());
        if (foundStudent) {
          resolvedStudentId = foundStudent.originalId ? foundStudent.originalId.toString() : foundStudent._id.toString();
          resolvedStudentName = foundStudent.name;
        }
      }

      return {
        ...s,
        id: s._id.toString(),
        _id: s._id.toString(),
        studentId: resolvedStudentId,
        studentName: resolvedStudentName,
        assignmentId: assignment ? (assignment.originalId ? assignment.originalId.toString() : assignment._id.toString()) : null,
        status: s.status || 'Pending',
        file: s.file || null,
        graded: s.graded || false,
        score: s.score || null,
        submissionDate: s.submissionDate || null,
        feedback: s.feedback || null
      };
    });

    console.log("=== GET /api/data RESPONSE ===");
    console.log("Submissions Flattened Payload (Sample 1):", mappedSubmissions[0]);

    res.json({
      classes: mappedClasses,
      students: mappedStudents,
      assignments: mappedAssignments,
      submissions: mappedSubmissions
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 2. POST /api/assignments
app.post('/api/assignments', upload.single('file'), async (req, res) => {
  try {
    const { id, title, subject, classId, dueDate, dueTime, rubrics } = req.body;
    const parsedRubrics = typeof rubrics === 'string' ? JSON.parse(rubrics) : rubrics;
    const cls = await Class.findOne({ originalId: classId });
    
    const filePath = req.file ? `/uploads/assignments/${req.file.filename}` : null;

    const newAssignment = new Assignment({
      title,
      subject,
      classId: cls ? cls._id : null,
      dueDate,
      dueTime,
      originalId: id,
      file: filePath,
      rubrics: parsedRubrics || { code: 25, func: 50, doc: 25 }
    });

    await newAssignment.save();
    
    const mappedAssignment = {
      _id: newAssignment._id.toString(),
      id: newAssignment.originalId?.toString() || newAssignment._id.toString(),
      title: newAssignment.title,
      subject: newAssignment.subject,
      classId: newAssignment.classId?.toString(),
      dueDate: newAssignment.dueDate,
      dueTime: newAssignment.dueTime,
      file: newAssignment.file,
      rubrics: newAssignment.rubrics
    };

    console.log("=== POST /api/assignments ===");
    console.log("New Assignment Saved:", mappedAssignment);

    res.status(201).json({ message: 'Assignment created successfully', newAssignment: mappedAssignment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating assignment' });
  }
});

// 3. PUT /api/submissions/:studentId/:assignmentId
app.put('/api/submissions/:studentId/:assignmentId', upload.single('file'), async (req, res) => {
  try {
    const { studentId, assignmentId } = req.params;
    
    const status = req.body.status;
    const graded = req.body.graded !== undefined ? String(req.body.graded) === 'true' : undefined;
    
    let score = undefined;
    if (req.body.score) {
      score = typeof req.body.score === 'string' ? JSON.parse(req.body.score) : req.body.score;
    }

    const submissionDate = req.body.submissionDate;
    const feedback = req.body.feedback;

    let fileNameToSave = req.body.file;
    if (req.file) {
      fileNameToSave = `/uploads/submissions/${req.file.filename}`;
    }

    const student = await Student.findOne({ 
      $or: [{ rollNo: studentId }, { originalId: studentId }]
    });
    // Keep support for both String or Number assignmentIds based on migration mapping
    const assignment = await Assignment.findOne({ 
      $or: [{ originalId: Number(assignmentId) }, { originalId: String(assignmentId) }] 
    });

    if (!student || !assignment) {
      return res.status(404).json({ message: 'Student or Assignment not found' });
    }

    const updateData = {
      studentId: student._id,
      assignmentId: assignment._id,
      ...(status !== undefined && { status }),
      ...(fileNameToSave !== undefined && { file: fileNameToSave }),
      ...(graded !== undefined && { graded }),
      ...(score !== undefined && { score }),
      ...(submissionDate !== undefined && { submissionDate }),
      ...(feedback !== undefined && { feedback })
    };

    const updatedScore = await Score.findOneAndUpdate(
      { studentId: student._id, assignmentId: assignment._id },
      updateData,
      { upsert: true, new: true }
    ).populate('studentId', 'name originalId').lean();

    const mappedSub = {
      _id: updatedScore._id.toString(),
      studentId: updatedScore.studentId ? (updatedScore.studentId.originalId ? updatedScore.studentId.originalId.toString() : updatedScore.studentId._id.toString()) : null,
      studentName: updatedScore.studentId ? updatedScore.studentId.name : 'Unknown',
      assignmentId: assignment.originalId ? assignment.originalId.toString() : assignment._id.toString(),
      status: updatedScore.status,
      file: updatedScore.file,
      graded: updatedScore.graded,
      score: updatedScore.score,
      submissionDate: updatedScore.submissionDate,
      feedback: updatedScore.feedback || null
    };

    console.log("=== PUT /api/submissions ===");
    console.log("Submission Updated:", mappedSub);

    res.json({ message: 'Submission updated', updatedScore: mappedSub });
  } catch (error) {
    console.error("PUT Error", error);
    res.status(500).json({ message: 'Server error updating submission' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
