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
import Note from './models/Note.model.js';
import Teacher from './models/Teacher.model.js';
import User from './models/User.model.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Setup file uploads
const assignmentsDir = path.join(__dirname, 'uploads', 'assignments');
const submissionsDir = path.join(__dirname, 'uploads', 'submissions');
const notesDir = path.join(__dirname, 'uploads', 'notes');

if (!fs.existsSync(assignmentsDir)) fs.mkdirSync(assignmentsDir, { recursive: true });
if (!fs.existsSync(submissionsDir)) fs.mkdirSync(submissionsDir, { recursive: true });
if (!fs.existsSync(notesDir)) fs.mkdirSync(notesDir, { recursive: true });

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.originalUrl.includes('/api/assignments')) {
      cb(null, assignmentsDir);
    } else if (req.originalUrl.includes('/api/notes')) {
      cb(null, notesDir);
    } else {
      cb(null, submissionsDir);
    }
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    if (req.originalUrl.includes('/api/assignments')) {
      cb(null, `${Date.now()}-${cleanName}`);
    } else if (req.originalUrl.includes('/api/notes')) {
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

// 0. POST /api/login - Authenticate user against MongoDB
app.post('/api/login', async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await User.findOne({ userId });

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid ID or Password' });
    }

    res.json({ success: true, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 1. GET /api/data - Fetch all initial data using Promise.all
app.get('/api/data', async (req, res) => {
  try {
    const [classes, students, assignments, scores, notes, teachers] = await Promise.all([
      Class.find({}).lean(),
      Student.find({}).lean(),
      Assignment.find({}).lean(),
      Score.find({}).populate('studentId', 'name originalId').lean(),
      Note.find({}).lean(),
      Teacher.find({}).lean()
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

    const mappedTeachers = teachers.map(t => {
      // Map ObjectId back to originalId (Numbers) for the frontend if needed
      const mappedClassIds = (t.assignedClasses || []).map(clsObjId => {
        const foundCls = classes.find(c => c._id.toString() === clsObjId.toString());
        return foundCls ? (foundCls.originalId ? foundCls.originalId : foundCls._id.toString()) : clsObjId;
      });

      return {
        ...t,
        id: t.originalId ? t.originalId : t._id.toString(),
        _id: t._id.toString(),
        assignedClasses: mappedClassIds
      };
    });

    console.log("=== GET /api/data RESPONSE ===");
    console.log("Submissions Flattened Payload (Sample 1):", mappedSubmissions[0]);

    res.json({
      classes: mappedClasses,
      students: mappedStudents,
      assignments: mappedAssignments,
      submissions: mappedSubmissions,
      teachers: mappedTeachers,
      notes: notes.map(n => {
        const cls = classes.find(c => c._id.toString() === n.classId?.toString());
        return {
          ...n,
          id: n._id.toString(),
          classId: cls ? (cls.originalId ? cls.originalId.toString() : cls._id.toString()) : null
        };
      })
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
      classId: cls ? (cls.originalId ? cls.originalId.toString() : cls._id.toString()) : newAssignment.classId?.toString(),
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

// 4. POST /api/notes
app.post('/api/notes', upload.single('file'), async (req, res) => {
  try {
    const { title, subject, classId } = req.body;
    const cls = await Class.findOne({ originalId: classId });
    const filePath = req.file ? `/uploads/notes/${req.file.filename}` : null;

    const newNote = new Note({
      title,
      subject,
      classId: cls ? cls._id : null,
      file: filePath,
      date: new Date().toLocaleDateString('en-GB') // DD/MM/YYYY
    });

    await newNote.save();

    const mappedNote = {
      ...newNote.toObject(),
      id: newNote._id.toString(),
      classId: classId // return originalId to match frontend
    };

    res.status(201).json({ message: 'Note shared successfully', note: mappedNote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error sharing note' });
  }
});

// --- ADMIN ROUTES ---

// 5. POST /api/classes
app.post('/api/classes', async (req, res) => {
  try {
    const { name, originalId } = req.body;
    if (!originalId || Number(originalId) <= 0) {
      return res.status(400).json({ message: 'Class ID (originalId) must be a positive integer' });
    }
    const newClass = new Class({ name, originalId: Number(originalId) });
    await newClass.save();
    res.status(201).json({ message: 'Class created', class: { ...newClass.toObject(), id: newClass.originalId } });
  } catch (error) {
    res.status(500).json({ message: 'Server error creating class' });
  }
});

// 5b. DELETE /api/classes/:id
app.delete('/api/classes/:id', async (req, res) => {
  try {
    const classId = req.params.id;
    const cls = await Class.findById(classId);
    if (!cls) return res.status(404).json({ message: 'Class not found' });

    // Step 1: Delete the class
    await Class.findByIdAndDelete(classId);

    // Step 2: Unassign all students belonging to this class
    await Student.updateMany(
      { classId: cls._id },
      { $set: { classId: null } }
    );

    // Step 3: Remove this class from all teachers' assignment arrays
    await Teacher.updateMany(
      { assignedClasses: cls._id },
      { $pull: { assignedClasses: cls._id } }
    );

    res.json({ message: 'Class deleted and users unassigned successfully' });
  } catch (error) {
    console.error('Delete Class Error:', error);
    res.status(500).json({ message: 'Server error deleting class' });
  }
});

// 6. POST /api/students
app.post('/api/students', async (req, res) => {
  try {
    const { rollNo, name, branch, classId } = req.body;
    if (Array.isArray(req.body)) {
      try {
        // Bulk create
        const mapped = req.body.map(s => ({ ...s, originalId: s.rollNo }));
        const inserted = await Student.insertMany(mapped);
        // Auto-create User credentials for each bulk student
        for (const s of inserted) {
          await User.findOneAndUpdate(
            { userId: s.rollNo },
            { userId: s.rollNo, password: 'password123', role: 'student' },
            { upsert: true }
          );
        }
        return res.status(201).json({ message: 'Bulk students created', students: inserted });
      } catch (bulkError) {
        console.error('Error in bulk student upload:', bulkError);
        if (bulkError.code === 11000) {
          return res.status(400).json({ message: 'Duplicate ID detected. One or more students in the CSV already exist.' });
        }
        return res.status(500).json({ message: 'Server error during bulk student upload' });
      }
    }
    const cls = await Class.findOne({ originalId: classId });
    const newStudent = new Student({ rollNo, originalId: rollNo, name, branch: branch || '', classId: cls ? cls._id : null });
    await newStudent.save();
    // Auto-create User credentials for login
    await User.findOneAndUpdate(
      { userId: rollNo },
      { userId: rollNo, password: 'password123', role: 'student' },
      { upsert: true }
    );
    res.status(201).json({ message: 'Student created', student: { ...newStudent.toObject(), id: newStudent.originalId } });
  } catch (error) {
    console.error('Error creating student:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate ID detected. A student with this Roll No already exists.' });
    }
    res.status(500).json({ message: 'Server error creating student' });
  }
});

// 7. POST /api/teachers
app.post('/api/teachers', async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      try {
        // Bulk create
        const mapped = req.body.map(t => ({ 
          ...t, 
          originalId: t.empId,
          assignedClasses: t.assignedClasses || []
        }));
        const inserted = await Teacher.insertMany(mapped);
        // Auto-create User credentials for each bulk teacher
        for (const t of inserted) {
          await User.findOneAndUpdate(
            { userId: t.empId },
            { userId: t.empId, password: 'password123', role: 'teacher' },
            { upsert: true }
          );
        }
        return res.status(201).json({ message: 'Bulk teachers created', teachers: inserted });
      } catch (bulkError) {
        console.error('Error in bulk teacher upload:', bulkError);
        if (bulkError.code === 11000) {
          return res.status(400).json({ message: 'Duplicate ID detected. One or more teachers in the CSV already exist.' });
        }
        return res.status(500).json({ message: 'Server error during bulk teacher upload' });
      }
    }

    const { empId, name, dept, assignedClasses } = req.body;
    const newTeacher = new Teacher({ 
      empId, 
      originalId: empId, 
      name, 
      dept, 
      assignedClasses: assignedClasses || [] 
    });
    await newTeacher.save();
    // Auto-create User credentials for login
    await User.findOneAndUpdate(
      { userId: empId },
      { userId: empId, password: 'password123', role: 'teacher' },
      { upsert: true }
    );
    res.status(201).json({ message: 'Teacher created', teacher: { ...newTeacher.toObject(), id: newTeacher.originalId } });
  } catch (error) {
    console.error('Error creating teacher:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate ID detected. A teacher with this Emp ID already exists.' });
    }
    res.status(500).json({ message: 'Server error creating teacher' });
  }
});

// 8. PUT /api/students/:id
app.put('/api/students/:id', async (req, res) => {
  try {
    const { name, rollNo, branch, classId } = req.body;
    const cls = classId ? await Class.findOne({ $or: [{ originalId: classId }, { originalId: Number(classId) }] }) : null;
    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      { name, rollNo, branch, ...(cls && { classId: cls._id }) },
      { new: true }

    );
    if (!updated) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student updated', student: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating student' });
  }
});

// 8b. PATCH /api/students/:id/class
app.patch('/api/students/:id/class', async (req, res) => {
  try {
    const { classId } = req.body;
    let clsIdToSet = null;
    
    if (classId) {
      // Find the class by its _id or originalId
      const cls = await Class.findOne({ $or: [{ _id: classId }, { originalId: classId }, { originalId: Number(classId) }] });
      if (cls) clsIdToSet = cls._id;
    }

    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      { classId: clsIdToSet },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student class updated', student: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating student class' });
  }
});

// 9. DELETE /api/students/:id
app.delete('/api/students/:id', async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Student not found' });
    // Also remove login credentials
    await User.findOneAndDelete({ userId: deleted.rollNo });
    res.json({ message: 'Student and credentials deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting student' });
  }
});

// 10. PUT /api/teachers/:id
app.put('/api/teachers/:id', async (req, res) => {
  try {
    const { name, empId, dept } = req.body;
    const updated = await Teacher.findByIdAndUpdate(
      req.params.id,
      { name, empId, dept },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Teacher not found' });
    res.json({ message: 'Teacher updated', teacher: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating teacher' });
  }
});

// 11. DELETE /api/teachers/:id
app.delete('/api/teachers/:id', async (req, res) => {
  try {
    const deleted = await Teacher.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Teacher not found' });
    // Also remove login credentials
    await User.findOneAndDelete({ userId: deleted.empId });
    res.json({ message: 'Teacher and credentials deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting teacher' });
  }
});

// 12. PATCH /api/teachers/:id/classes — update a teacher's assigned class list
app.patch('/api/teachers/:id/classes', async (req, res) => {
  try {
    const { classIds } = req.body; // array of originalId numbers/strings e.g. [1, 3]
    const classDocs = await Class.find({ originalId: { $in: classIds.map(Number) } });
    const objectIds = classDocs.map(c => c._id);

    const updated = await Teacher.findByIdAndUpdate(
      req.params.id,
      { assignedClasses: objectIds },
      { new: true }
    ).lean();

    if (!updated) return res.status(404).json({ message: 'Teacher not found' });
    res.json({ message: 'Teacher classes updated', teacher: updated });
  } catch (error) {
    console.error('PATCH /teachers/:id/classes error:', error);
    res.status(500).json({ message: 'Server error updating teacher classes' });
  }
});

// 13. GET /api/users — list all user credentials (admin only)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-__v').lean();
    res.json(users);
  } catch (error) {
    console.error('GET /api/users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// 14. PATCH /api/users/:userId/password — reset a user's password
app.patch('/api/users/:userId/password', async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 4) {
      return res.status(400).json({ message: 'Password must be at least 4 characters' });
    }
    const updated = await User.findOneAndUpdate(
      { userId: req.params.userId },
      { password },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('PATCH password error:', error);
    res.status(500).json({ message: 'Server error updating password' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
