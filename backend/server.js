import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;

// ------------------ MIDDLEWARES ------------------
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ------------------ MULTER PDF (Optional - Keep for teacher uploads) ------------------
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, "uploads");
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage });


function generateGenericQuiz(lesson, subject) {
    const genericQuizzes = [];
    for (let i = 1; i <= 10; i++) {
        genericQuizzes.push({
            question: `What is an important concept in ${lesson}? (Question ${i})`,
            options: [
                `Key concept ${Math.floor(Math.random() * 100)}`,
                `Important idea ${Math.floor(Math.random() * 100)}`,
                `Main topic ${Math.floor(Math.random() * 100)}`,
                `Core principle ${Math.floor(Math.random() * 100)}`
            ],
            answer: `Key concept ${Math.floor(Math.random() * 100)}`
        });
    }
    return genericQuizzes;
}
function generateQuizFromPDFText(text, lesson, subject) {
    const lines = text
        .split("\n")
        .map(l => l.trim())
        .filter(l => l.length > 20);

    const quiz = [];

    for (let i = 0; i < Math.min(10, lines.length); i++) {
        const qText = lines[i];

        quiz.push({
            question: qText,
            options: [
                "Option A",
                "Option B",
                "Option C",
                "Option D"
            ],
            answer: "Option A"
        });
    }

    return quiz;
}

function generateGenericQuiz(lesson, subject) {
    const genericQuizzes = [];
    for (let i = 1; i <= 10; i++) {
        genericQuizzes.push({
            question: `What is an important concept in ${lesson}? (Question ${i})`,
            options: [
                `Key concept ${Math.floor(Math.random() * 100)}`,
                `Important idea ${Math.floor(Math.random() * 100)}`,
                `Main topic ${Math.floor(Math.random() * 100)}`,
                `Core principle ${Math.floor(Math.random() * 100)}`
            ],
            answer: `Key concept ${Math.floor(Math.random() * 100)}`
        });
    }
    return genericQuizzes;
}

// ------------------ DATABASE ------------------
let students = [];
let teachers = [];
let lessonsDB = subjects;

let nextStudentId = 1;
let nextTeacherId = 1;
let nextHomeworkId = 1;

// ------------------ ROUTES ------------------

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ------------------ STUDENT ROUTES ------------------

app.post("/api/student/register", (req, res) => {
    const { name, grade } = req.body;

    if (!name || !grade) {
        return res.status(400).json({ error: "Name and grade required" });
    }

    const student = {
        id: nextStudentId++,
        name,
        grade: parseInt(grade),
        levels: {
            "Mathematics": {},
            "Science": {},
            "Social Sciences": {}
        },
        rewards: [],
        badges: [],
        homework: [],
        quizScores: {},
        createdAt: new Date().toISOString()
    };

    students.push(student);
    res.json({ success: true, student });
});

app.get("/api/student/:id", (req, res) => {
    const student = students.find(s => s.id == req.params.id);
    if (!student) {
        return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
});

app.get("/api/students", (req, res) => {
    res.json(students);
});

app.post("/api/student/quiz-score", (req, res) => {
    const { studentId, subject, lesson, score } = req.body;

    const student = students.find(s => s.id == studentId);
    if (!student) {
        return res.status(404).json({ error: "Student not found" });
    }

    const stars = Math.round((score / 100) * 5);

    if (!student.levels[subject]) {
        student.levels[subject] = {};
    }

    student.levels[subject][lesson] = {
        completed: true,
        score,
        stars,
        completedAt: new Date().toISOString()
    };

    if (stars === 5) {
        const badge = `${lesson} Star Performer`;
        if (!student.badges.includes(badge)) {
            student.badges.push(badge);
        }
    }

    student.rewards.push({
        id: Date.now(),
        subject,
        lesson,
        stars,
        score,
        earnedAt: new Date().toISOString()
    });

    res.json({
        success: true,
        message: "Score updated",
        stars
    });
});

app.post("/api/student/submit-homework", (req, res) => {
    const { studentId, homeworkId, submission } = req.body;

    const student = students.find(s => s.id == studentId);
    if (!student) {
        return res.status(404).json({ error: "Student not found" });
    }

    const homeworkIndex = student.homework.findIndex(h => h.id == homeworkId);

    if (homeworkIndex === -1) {
        return res.status(404).json({ error: "Homework not found" });
    }

    student.homework[homeworkIndex].completed = true;
    student.homework[homeworkIndex].submission = submission;
    student.homework[homeworkIndex].submittedAt = new Date().toISOString();

    res.json({ success: true, message: "Homework submitted" });
});

// ------------------ TEACHER ROUTES ------------------

app.post("/api/teacher/register", (req, res) => {
    const { name, grade, subject } = req.body;

    if (!name || !grade || !subject) {
        return res.status(400).json({ error: "All fields required" });
    }

    const teacher = {
        id: nextTeacherId++,
        name,
        grade: parseInt(grade),
        subject, // Mathematics, Science, or Social Sciences
        uploadedPDFs: [],
        homeworkAssigned: [],
        createdAt: new Date().toISOString()
    };

    teachers.push(teacher);
    res.json({ success: true, teacher });
});
app.post("/api/teacher/upload-quiz-pdf", upload.single("pdf"), async (req, res) => {
    try {
        const { subject, lesson } = req.body;

        if (!subject || !lesson) {
            return res.status(400).json({ error: "Subject and lesson required" });
        }

        if (!req.file) {
            return res.status(400).json({ error: "PDF file required" });
        }

        // Read PDF
        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdfParse(dataBuffer);

        const text = pdfData.text;

        // Generate quiz
        const generatedQuiz = generateQuizFromPDFText(text, lesson, subject);

        // Ensure subject exists
        if (!lessonsDB[subject]) {
            lessonsDB[subject] = {};
        }

        // Replace or add lesson quiz
        lessonsDB[subject][lesson] = generatedQuiz;

        // Delete uploaded file (cleanup)
        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            message: "Quiz generated and added successfully 🎉",
            subject,
            lesson,
            totalQuestions: generatedQuiz.length
        });

    } catch (error) {
        console.error("PDF Quiz Error:", error);
        res.status(500).json({ error: "Failed to process PDF" });
    }
});
app.get("/api/teacher/:id", (req, res) => {
    const teacher = teachers.find(t => t.id == req.params.id);
    if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
    }
    res.json(teacher);
});

// UPDATED: Get students progress filtered by teacher's subject
app.get("/api/teacher/:id/students-progress", (req, res) => {
    const teacher = teachers.find(t => t.id == req.params.id);
    if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
    }

    // Filter students progress only for the teacher's subject
    const studentsProgress = students.map(student => {
        const progress = {};
        // Only include the teacher's subject in the progress
        if (student.levels[teacher.subject]) {
            progress[teacher.subject] = {};
            for (let lesson in student.levels[teacher.subject]) {
                progress[teacher.subject][lesson] = student.levels[teacher.subject][lesson].score || 0;
            }
        }
        return {
            id: student.id,
            name: student.name,
            grade: student.grade,
            progress
        };
    }).filter(student => Object.keys(student.progress).length > 0); // Only show students who have progress in this subject

    res.json(studentsProgress);
});

// UPDATED: Get lessons filtered by teacher's subject
app.get("/api/teacher/:id/lessons", (req, res) => {
    const teacher = teachers.find(t => t.id == req.params.id);
    if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
    }

    // Return only the lessons for the teacher's subject
    const teacherLessons = {};
    teacherLessons[teacher.subject] = lessonsDB[teacher.subject] || {};

    res.json(teacherLessons);
});

app.post("/api/teacher/upload-pdf", upload.single("pdf"), async (req, res) => {
    res.json({
        success: true,
        message: "Auto-generated quizzes are already available! No need to upload PDFs."
    });
});

app.post("/api/teacher/assign-homework", (req, res) => {
    const { teacherId, studentId, homework, subject, lesson, dueDate } = req.body;

    if (!teacherId || !studentId || !homework) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const teacher = teachers.find(t => t.id == teacherId);
    const student = students.find(s => s.id == studentId);

    if (!teacher || !student) {
        return res.status(404).json({ error: "Teacher or student not found" });
    }

    const homeworkItem = {
        id: nextHomeworkId++,
        from: teacher.name,
        content: homework,
        subject: subject || teacher.subject,
        lesson: lesson || "General",
        assignedAt: new Date().toISOString(),
        dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        completed: false
    };

    student.homework.push(homeworkItem);

    teacher.homeworkAssigned.push({
        studentId,
        studentName: student.name,
        homework: homeworkItem
    });

    res.json({ success: true, message: "Homework assigned" });
});

// ------------------ LESSON ROUTES ------------------

app.get("/api/lessons", (req, res) => {
    res.json(lessonsDB);
});

app.get("/api/lesson/:subject/:lesson/quiz", (req, res) => {
    const { subject, lesson } = req.params;

    if (!lessonsDB[subject] || !lessonsDB[subject][lesson]) {
        return res.json({ quiz: null });
    }

    res.json({
        quiz: lessonsDB[subject][lesson]
    });
});

app.get("/uploads/:filename", (req, res) => {
    const filePath = path.join(__dirname, "uploads", req.params.filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ error: "File not found" });
    }
});

app.listen(PORT, () => {
    console.log(`\n✅ Server running at http://localhost:${PORT}`);
    console.log(`📚 Auto-generated content:`);
    console.log(`   - 3 Subjects`);
    console.log(`   - 5 Lessons per subject`);
    console.log(`   - 10 Quiz questions per lesson`);
    console.log(`   - Total: 150 quiz questions available!`);
    console.log(`\n👨‍🏫 Teacher Subject Filter:`);
    console.log(`   - Math teachers see only Math student progress`);
    console.log(`   - Science teachers see only Science student progress`);
    console.log(`   - Social Science teachers see only Social Science student progress\n`);
});
