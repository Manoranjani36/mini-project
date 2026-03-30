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

// ------------------ AUTO-GENERATED LESSONS AND QUIZZES ------------------
const subjects = {
    "Mathematics": {
        "Algebra Basics": generateQuiz("Algebra Basics", "Mathematics"),
        "Geometry": generateQuiz("Geometry", "Mathematics"),
        "Trigonometry": generateQuiz("Trigonometry", "Mathematics"),
        "Calculus": generateQuiz("Calculus", "Mathematics"),
        "Statistics": generateQuiz("Statistics", "Mathematics")
    },
    "Science": {
        "Physics": generateQuiz("Physics", "Science"),
        "Chemistry": generateQuiz("Chemistry", "Science"),
        "Biology": generateQuiz("Biology", "Science"),
        "Astronomy": generateQuiz("Astronomy", "Science"),
        "Environmental Science": generateQuiz("Environmental Science", "Science")
    },
    "Social Sciences": {
        "History": generateQuiz("History", "Social Sciences"),
        "Geography": generateQuiz("Geography", "Social Sciences"),
        "Economics": generateQuiz("Economics", "Social Sciences"),
        "Political Science": generateQuiz("Political Science", "Social Sciences"),
        "Sociology": generateQuiz("Sociology", "Social Sciences")
    }
};

// Function to generate 10 quiz questions for a lesson
function generateQuiz(lesson, subject) {
    const quizzes = {
        // Mathematics Quizzes
        "Algebra Basics": [
            { question: "What is the value of x in the equation 2x + 5 = 15?", options: ["5", "10", "7", "8"], answer: "5" },
            { question: "What is the formula for the area of a rectangle?", options: ["l × w", "l + w", "2(l + w)", "l²"], answer: "l × w" },
            { question: "What is the slope of the line y = 3x + 2?", options: ["2", "3", "5", "1"], answer: "3" },
            { question: "What is the square root of 144?", options: ["10", "11", "12", "13"], answer: "12" },
            { question: "What is 15% of 200?", options: ["20", "25", "30", "35"], answer: "30" },
            { question: "What is the value of 3²?", options: ["6", "9", "12", "15"], answer: "9" },
            { question: "What is the formula for the volume of a cube?", options: ["s²", "s³", "6s²", "4s"], answer: "s³" },
            { question: "What is the value of π (pi) approximately?", options: ["3.14", "2.14", "4.14", "5.14"], answer: "3.14" },
            { question: "What is the sum of angles in a triangle?", options: ["90°", "180°", "270°", "360°"], answer: "180°" },
            { question: "What is 8 × 7?", options: ["54", "56", "58", "60"], answer: "56" }
        ],
        "Geometry": [
            { question: "What is the perimeter of a square with side 5 cm?", options: ["20 cm", "25 cm", "15 cm", "10 cm"], answer: "20 cm" },
            { question: "What is the area of a circle with radius 7 cm? (π = 22/7)", options: ["154 cm²", "144 cm²", "164 cm²", "174 cm²"], answer: "154 cm²" },
            { question: "How many sides does a hexagon have?", options: ["4", "5", "6", "7"], answer: "6" },
            { question: "What is the Pythagorean theorem?", options: ["a² + b² = c²", "a + b = c", "a × b = c", "a / b = c"], answer: "a² + b² = c²" },
            { question: "What is the sum of interior angles of a pentagon?", options: ["360°", "540°", "720°", "900°"], answer: "540°" },
            { question: "What is the diameter of a circle with radius 10 cm?", options: ["5 cm", "10 cm", "15 cm", "20 cm"], answer: "20 cm" },
            { question: "What shape has 4 equal sides and 4 right angles?", options: ["Rectangle", "Square", "Rhombus", "Trapezoid"], answer: "Square" },
            { question: "What is the volume of a cylinder with radius 3 cm and height 5 cm?", options: ["45π cm³", "30π cm³", "15π cm³", "60π cm³"], answer: "45π cm³" },
            { question: "What is the circumference of a circle with diameter 14 cm?", options: ["44 cm", "48 cm", "52 cm", "56 cm"], answer: "44 cm" },
            { question: "How many degrees in a right angle?", options: ["45°", "90°", "180°", "360°"], answer: "90°" }
        ],
        "Trigonometry": [
            { question: "What is sin(90°)", options: ["0", "1", "-1", "∞"], answer: "1" },
            { question: "What is cos(0°)", options: ["0", "1", "-1", "∞"], answer: "1" },
            { question: "What is tan(45°)", options: ["0", "1", "-1", "∞"], answer: "1" },
            { question: "What is sin(30°)", options: ["0.5", "0.866", "1", "0"], answer: "0.5" },
            { question: "What is cos(60°)", options: ["0.5", "0.866", "1", "0"], answer: "0.5" },
            { question: "What is the Pythagorean identity?", options: ["sin²θ + cos²θ = 1", "sin²θ - cos²θ = 1", "sinθ + cosθ = 1", "sinθ × cosθ = 1"], answer: "sin²θ + cos²θ = 1" },
            { question: "What is the value of sec(0°)", options: ["0", "1", "-1", "∞"], answer: "1" },
            { question: "What is cot(45°)", options: ["0", "1", "-1", "∞"], answer: "1" },
            { question: "What is the period of sin(x)?", options: ["π", "2π", "π/2", "4π"], answer: "2π" },
            { question: "What is the range of sin(x)?", options: ["[-1,1]", "[0,1]", "[-2,2]", "[0,∞]"], answer: "[-1,1]" }
        ],
        "Calculus": [
            { question: "What is the derivative of x²?", options: ["2x", "x", "2", "x²"], answer: "2x" },
            { question: "What is the integral of 2x dx?", options: ["x²", "x² + C", "2x²", "2x² + C"], answer: "x² + C" },
            { question: "What is the derivative of sin(x)?", options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"], answer: "cos(x)" },
            { question: "What is the integral of cos(x) dx?", options: ["sin(x) + C", "-sin(x) + C", "cos(x) + C", "-cos(x) + C"], answer: "sin(x) + C" },
            { question: "What is the derivative of eˣ?", options: ["eˣ", "xeˣ", "x²eˣ", "0"], answer: "eˣ" },
            { question: "What is the derivative of ln(x)?", options: ["1/x", "x", "eˣ", "x²"], answer: "1/x" },
            { question: "What is the limit of sin(x)/x as x→0?", options: ["0", "1", "∞", "π"], answer: "1" },
            { question: "What is the derivative of 5x³?", options: ["15x²", "5x²", "10x²", "20x²"], answer: "15x²" },
            { question: "What is the integral of 1/x dx?", options: ["ln|x| + C", "eˣ + C", "x² + C", "1/x² + C"], answer: "ln|x| + C" },
            { question: "What is the derivative of cos(x)?", options: ["-sin(x)", "sin(x)", "-cos(x)", "cos(x)"], answer: "-sin(x)" }
        ],
        "Statistics": [
            { question: "What is the mean of 2,4,6,8,10?", options: ["5", "6", "7", "8"], answer: "6" },
            { question: "What is the median of 1,3,5,7,9?", options: ["3", "5", "7", "9"], answer: "5" },
            { question: "What is the mode of 2,2,3,4,4,4,5?", options: ["2", "3", "4", "5"], answer: "4" },
            { question: "What is the range of 10,20,30,40,50?", options: ["10", "20", "30", "40"], answer: "40" },
            { question: "What is the probability of getting heads in a coin toss?", options: ["0.5", "0.25", "0.75", "1"], answer: "0.5" },
            { question: "What is the variance?", options: ["Average of squared deviations", "Standard deviation squared", "Both A and B", "None"], answer: "Both A and B" },
            { question: "What is the standard deviation?", options: ["√variance", "variance²", "mean²", "range"], answer: "√variance" },
            { question: "What is the probability of rolling a 6 on a die?", options: ["1/6", "1/2", "1/3", "1/4"], answer: "1/6" },
            { question: "What is the mean of first 5 natural numbers?", options: ["2", "3", "4", "5"], answer: "3" },
            { question: "What is the median of 2,4,6,8,10,12?", options: ["6", "7", "8", "9"], answer: "7" }
        ],

        // Science Quizzes
        "Physics": [
            { question: "What is Newton's First Law?", options: ["Law of Inertia", "F=ma", "Action-Reaction", "Gravity"], answer: "Law of Inertia" },
            { question: "What is the unit of force?", options: ["Newton", "Joule", "Watt", "Pascal"], answer: "Newton" },
            { question: "What is the speed of light?", options: ["3×10⁸ m/s", "3×10⁶ m/s", "3×10⁵ m/s", "3×10⁷ m/s"], answer: "3×10⁸ m/s" },
            { question: "What is the formula for kinetic energy?", options: ["½mv²", "mgh", "ma", "mv"], answer: "½mv²" },
            { question: "What is the unit of energy?", options: ["Joule", "Newton", "Watt", "Pascal"], answer: "Joule" },
            { question: "What is Ohm's Law?", options: ["V=IR", "P=IV", "E=mc²", "F=ma"], answer: "V=IR" },
            { question: "What is the unit of resistance?", options: ["Ohm", "Volt", "Ampere", "Watt"], answer: "Ohm" },
            { question: "What is the acceleration due to gravity?", options: ["9.8 m/s²", "9.8 m/s", "9.8 m", "9.8 s"], answer: "9.8 m/s²" },
            { question: "What is the formula for work?", options: ["F×d", "F×t", "m×a", "m×v"], answer: "F×d" },
            { question: "What is the unit of power?", options: ["Watt", "Joule", "Newton", "Pascal"], answer: "Watt" }
        ],
        "Chemistry": [
            { question: "What is the atomic number of Hydrogen?", options: ["1", "2", "3", "4"], answer: "1" },
            { question: "What is H₂O?", options: ["Water", "Oxygen", "Hydrogen", "Carbon"], answer: "Water" },
            { question: "What is the pH of pure water?", options: ["7", "0", "14", "1"], answer: "7" },
            { question: "What is the symbol for Gold?", options: ["Au", "Ag", "Fe", "Cu"], answer: "Au" },
            { question: "What is the formula for Carbon Dioxide?", options: ["CO₂", "CO", "C₂O", "C O₂"], answer: "CO₂" },
            { question: "What is the atomic mass of Carbon?", options: ["12", "14", "16", "18"], answer: "12" },
            { question: "What is the periodic table?", options: ["Arrangement of elements", "List of compounds", "Chemical reactions", "Atomic models"], answer: "Arrangement of elements" },
            { question: "What is the symbol for Oxygen?", options: ["O", "Ox", "On", "Oy"], answer: "O" },
            { question: "What is the formula for Sodium Chloride?", options: ["NaCl", "NaCl₂", "Na₂Cl", "NaCl₃"], answer: "NaCl" },
            { question: "What is the chemical symbol for Iron?", options: ["Fe", "Ir", "In", "I"], answer: "Fe" }
        ],
        "Biology": [
            { question: "What is the basic unit of life?", options: ["Cell", "Atom", "Molecule", "Tissue"], answer: "Cell" },
            { question: "What is the powerhouse of the cell?", options: ["Mitochondria", "Nucleus", "Ribosome", "Golgi"], answer: "Mitochondria" },
            { question: "What is the process of photosynthesis?", options: ["Plants make food", "Animals breathe", "Cell division", "Energy release"], answer: "Plants make food" },
            { question: "What is the largest organ in the human body?", options: ["Skin", "Heart", "Liver", "Brain"], answer: "Skin" },
            { question: "What is the function of the heart?", options: ["Pump blood", "Filter waste", "Digest food", "Think"], answer: "Pump blood" },
            { question: "What is DNA?", options: ["Genetic material", "Protein", "Carbohydrate", "Lipid"], answer: "Genetic material" },
            { question: "What is the process of cell division?", options: ["Mitosis", "Photosynthesis", "Respiration", "Digestion"], answer: "Mitosis" },
            { question: "What is the function of lungs?", options: ["Exchange gases", "Pump blood", "Filter waste", "Store food"], answer: "Exchange gases" },
            { question: "What is the human body's largest artery?", options: ["Aorta", "Vein", "Capillary", "Arteriole"], answer: "Aorta" },
            { question: "What is the scientific name for humans?", options: ["Homo sapiens", "Homo erectus", "Homo habilis", "Homo neanderthalensis"], answer: "Homo sapiens" }
        ],
        "Astronomy": [
            { question: "What is the closest star to Earth?", options: ["Sun", "Proxima Centauri", "Alpha Centauri", "Sirius"], answer: "Sun" },
            { question: "How many planets in our solar system?", options: ["8", "9", "7", "10"], answer: "8" },
            { question: "What is the largest planet?", options: ["Jupiter", "Saturn", "Neptune", "Uranus"], answer: "Jupiter" },
            { question: "What is a galaxy?", options: ["Star system", "Planet", "Moon", "Comet"], answer: "Star system" },
            { question: "What is the Milky Way?", options: ["Our galaxy", "A planet", "A star", "A moon"], answer: "Our galaxy" },
            { question: "What is a black hole?", options: ["Gravity trap", "Star", "Planet", "Comet"], answer: "Gravity trap" },
            { question: "What is the hottest planet?", options: ["Venus", "Mercury", "Mars", "Jupiter"], answer: "Venus" },
            { question: "What is a comet made of?", options: ["Ice and dust", "Rock", "Gas", "Metal"], answer: "Ice and dust" },
            { question: "What is the name of Earth's moon?", options: ["Moon", "Luna", "Selene", "All above"], answer: "All above" },
            { question: "What is a light year?", options: ["Distance", "Time", "Speed", "Mass"], answer: "Distance" }
        ],
        "Environmental Science": [
            { question: "What is the greenhouse effect?", options: ["Global warming", "Cooling effect", "Wind pattern", "Rain cycle"], answer: "Global warming" },
            { question: "What is recycling?", options: ["Reusing materials", "Burning waste", "Dumping waste", "Creating waste"], answer: "Reusing materials" },
            { question: "What is pollution?", options: ["Harmful substances", "Clean air", "Pure water", "Fresh soil"], answer: "Harmful substances" },
            { question: "What is renewable energy?", options: ["Solar power", "Coal", "Oil", "Natural gas"], answer: "Solar power" },
            { question: "What is deforestation?", options: ["Cutting trees", "Planting trees", "Water pollution", "Air pollution"], answer: "Cutting trees" },
            { question: "What is biodiversity?", options: ["Variety of life", "Forest area", "Water bodies", "Mountain ranges"], answer: "Variety of life" },
            { question: "What is the ozone layer?", options: ["Protects from UV", "Traps heat", "Produces oxygen", "Creates rain"], answer: "Protects from UV" },
            { question: "What is climate change?", options: ["Long-term weather change", "Daily weather", "Seasonal change", "Wind change"], answer: "Long-term weather change" },
            { question: "What is a carbon footprint?", options: ["CO₂ emissions", "Carbon atom", "Carbon date", "Carbon cycle"], answer: "CO₂ emissions" },
            { question: "What is sustainable development?", options: ["Meet needs without harming future", "Quick growth", "Industrial growth", "Urban growth"], answer: "Meet needs without harming future" }
        ],

        // Social Sciences Quizzes
        "History": [
            { question: "Who discovered America?", options: ["Columbus", "Magellan", "Cook", "Vespucci"], answer: "Columbus" },
            { question: "What was the Renaissance?", options: ["Cultural movement", "War", "Plague", "Revolution"], answer: "Cultural movement" },
            { question: "Who was the first President of USA?", options: ["Washington", "Jefferson", "Adams", "Lincoln"], answer: "Washington" },
            { question: "What was World War I?", options: ["Global war 1914-1918", "Civil war", "Cold war", "Nuclear war"], answer: "Global war 1914-1918" },
            { question: "Who was Napoleon?", options: ["French leader", "German leader", "British leader", "Russian leader"], answer: "French leader" },
            { question: "What was the Industrial Revolution?", options: ["Factory era", "Digital age", "Space age", "Information age"], answer: "Factory era" },
            { question: "Who was Cleopatra?", options: ["Egyptian queen", "Greek queen", "Roman queen", "Persian queen"], answer: "Egyptian queen" },
            { question: "What was the Cold War?", options: ["US vs USSR tension", "Hot war", "Civil war", "World war"], answer: "US vs USSR tension" },
            { question: "Who was Julius Caesar?", options: ["Roman leader", "Greek leader", "Egyptian leader", "Persian leader"], answer: "Roman leader" },
            { question: "What was the French Revolution?", options: ["1789 revolution", "1776 revolution", "1917 revolution", "1848 revolution"], answer: "1789 revolution" }
        ],
        "Geography": [
            { question: "What is the largest ocean?", options: ["Pacific", "Atlantic", "Indian", "Arctic"], answer: "Pacific" },
            { question: "What is the longest river?", options: ["Nile", "Amazon", "Yangtze", "Mississippi"], answer: "Nile" },
            { question: "What is the highest mountain?", options: ["Everest", "K2", "Kangchenjunga", "Lhotse"], answer: "Everest" },
            { question: "What is the largest desert?", options: ["Sahara", "Gobi", "Arabian", "Kalahari"], answer: "Sahara" },
            { question: "What is the capital of France?", options: ["Paris", "London", "Berlin", "Madrid"], answer: "Paris" },
            { question: "What is the largest country?", options: ["Russia", "Canada", "USA", "China"], answer: "Russia" },
            { question: "What is the equator?", options: ["0° latitude", "0° longitude", "North pole", "South pole"], answer: "0° latitude" },
            { question: "What is a continent?", options: ["Large landmass", "Ocean", "Island", "Mountain"], answer: "Large landmass" },
            { question: "What is the capital of India?", options: ["New Delhi", "Mumbai", "Kolkata", "Chennai"], answer: "New Delhi" },
            { question: "What is the Amazon rainforest?", options: ["Tropical forest", "Desert", "Mountain", "Ocean"], answer: "Tropical forest" }
        ],
        "Economics": [
            { question: "What is supply and demand?", options: ["Market principle", "Government policy", "Bank rule", "Trade law"], answer: "Market principle" },
            { question: "What is GDP?", options: ["Economic output", "Government debt", "Tax revenue", "Trade balance"], answer: "Economic output" },
            { question: "What is inflation?", options: ["Price increase", "Price decrease", "Stable prices", "No change"], answer: "Price increase" },
            { question: "What is a budget?", options: ["Financial plan", "Tax policy", "Trade deal", "Bank loan"], answer: "Financial plan" },
            { question: "What is a recession?", options: ["Economic decline", "Economic growth", "Stable economy", "Inflation"], answer: "Economic decline" },
            { question: "What is interest rate?", options: ["Cost of borrowing", "Tax rate", "Wage rate", "Price rate"], answer: "Cost of borrowing" },
            { question: "What is a monopoly?", options: ["Single seller", "Many sellers", "No sellers", "Few sellers"], answer: "Single seller" },
            { question: "What is the stock market?", options: ["Shares trading", "Bond trading", "Real estate", "Commodities"], answer: "Shares trading" },
            { question: "What is tax?", options: ["Government revenue", "Private income", "Corporate profit", "Personal saving"], answer: "Government revenue" },
            { question: "What is unemployment?", options: ["No job", "No money", "No education", "No house"], answer: "No job" }
        ],
        "Political Science": [
            { question: "What is democracy?", options: ["People rule", "One ruler", "No ruler", "Military rule"], answer: "People rule" },
            { question: "What is the Constitution?", options: ["Supreme law", "Policy", "Regulation", "Ordinance"], answer: "Supreme law" },
            { question: "What is a parliament?", options: ["Legislative body", "Executive body", "Judicial body", "Military body"], answer: "Legislative body" },
            { question: "What is voting?", options: ["Choosing leaders", "Paying tax", "Working", "Studying"], answer: "Choosing leaders" },
            { question: "What is a political party?", options: ["Political group", "Social group", "Economic group", "Cultural group"], answer: "Political group" },
            { question: "What is human rights?", options: ["Basic freedoms", "Tax rights", "Property rights", "Business rights"], answer: "Basic freedoms" },
            { question: "What is a president?", options: ["Head of state", "Head of army", "Head of police", "Head of court"], answer: "Head of state" },
            { question: "What is a law?", options: ["Legal rule", "Social rule", "Moral rule", "Ethical rule"], answer: "Legal rule" },
            { question: "What is citizenship?", options: ["Member of state", "Resident", "Visitor", "Tourist"], answer: "Member of state" },
            { question: "What is a constitution?", options: ["Framework of government", "Business plan", "School rule", "Family rule"], answer: "Framework of government" }
        ],
        "Sociology": [
            { question: "What is society?", options: ["Group of people", "Group of animals", "Group of plants", "Group of things"], answer: "Group of people" },
            { question: "What is culture?", options: ["Shared beliefs", "Individual beliefs", "Family beliefs", "School beliefs"], answer: "Shared beliefs" },
            { question: "What is a family?", options: ["Basic social unit", "Work unit", "School unit", "Government unit"], answer: "Basic social unit" },
            { question: "What is education?", options: ["Learning process", "Working process", "Playing process", "Sleeping process"], answer: "Learning process" },
            { question: "What is gender?", options: ["Social roles", "Biological sex", "Age group", "Race group"], answer: "Social roles" },
            { question: "What is social class?", options: ["Economic status", "Political status", "Educational status", "Religious status"], answer: "Economic status" },
            { question: "What is community?", options: ["Shared location", "Shared work", "Shared school", "Shared family"], answer: "Shared location" },
            { question: "What is social change?", options: ["Society transformation", "Individual change", "Family change", "School change"], answer: "Society transformation" },
            { question: "What is urbanization?", options: ["City growth", "Village growth", "Town growth", "Rural growth"], answer: "City growth" },
            { question: "What is globalization?", options: ["World connection", "Local connection", "Regional connection", "National connection"], answer: "World connection" }
        ]
    };

    return quizzes[lesson] || generateGenericQuiz(lesson, subject);
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