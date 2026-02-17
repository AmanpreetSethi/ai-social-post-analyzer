const express = require("express");
const multer = require("multer");
const cors = require("cors");
const Tesseract = require("tesseract.js");
const pdfParse = require("pdf-parse"); 
const fs = require("fs");
const path = require("path");
// workaround for pdf-parse v2 in CommonJS
//async function parsePDF(buffer) {
//  const pdf = await import("pdf-parse");
//  return pdf.default(buffer);
//}

require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));
app.use(express.json());

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const upload = multer({ dest: uploadsDir });

const geminiKey = process.env.GEMINI_KEY;
if (!geminiKey) {
  console.warn("GEMINI_KEY is not set in .env – /upload will fail until configured.");
}
const genAI = new GoogleGenerativeAI(geminiKey || "");

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const userCaption = req.body.caption || "";
const platform = req.body.platform || "General";

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded. Use field name 'file'." });
    }
    if (!geminiKey) {
      return res.status(503).json({ error: "Server misconfigured: GEMINI_KEY not set in .env" });
    }

    let text = "";

   // detect if file is pdf
const isPDF =
  req.file.mimetype.includes("pdf") ||
  path.extname(req.file.originalname).toLowerCase() === ".pdf";

if (isPDF) {
  console.log("PDF detected");

  const buffer = fs.readFileSync(req.file.path);
  const data = await pdfParse(buffer);


  // if pdf has real text → use it
  if (data.text && data.text.trim().length > 20) {
    console.log("Text PDF → using parser");
    text = data.text.slice(0, 3000);
  }
  // otherwise scanned pdf → OCR fallback
  else {
    console.log("Scanned PDF → running OCR");
    const result = await Tesseract.recognize(req.file.path, "eng");
    text = result.data.text.slice(0, 3000);
  }

} else {
  console.log("Image file → OCR");
  const result = await Tesseract.recognize(req.file.path, "eng");
  text = result.data.text.slice(0, 3000);
}


    // send text to AI
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
     
    const prompt = `
You are a professional social media strategist.

CONTENT extracted from post:
${text}

USER ORIGINAL CAPTION:
${userCaption}

PLATFORM:
${platform}

Analyze and optimize the post.

Return ONLY JSON in this format:
{
sentiment: "",
engagement_score: number (1-10),
tone: "",
target_audience: "",
what_is_wrong_with_caption: "",
improvements: [3 points],
improved_caption: "",
hashtags: [5 optimized hashtags for ${platform}]
}
`;


    //const prompt = `
//Analyze this social media post and respond ONLY in JSON:

//Return:
//sentiment,
//engagement_score(1-10),
//tone,
//target_audience,
//improvements(3 points),
//improved_caption,
//hashtags(5)

//Post:
//${text}
//`;

    const ai = await model.generateContent(prompt);
    let aiText = ai.response.text().replace(/```json|```/g, "").trim();

    let analysis;
    try {
      analysis = JSON.parse(aiText);
    } catch {
      analysis = { raw: aiText };
    }

    res.json({ text, analysis });
  } catch (err) {
    console.error("Upload/analysis error:", err);
    res.status(500).json({
      error: "processing failed",
      message: err.message || "Unknown error",
    });
  } finally {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.warn("Could not delete temp file:", req.file.path, e.message);
      }
    }
  }

});

app.listen(5000, () => console.log("Server running on 5000"));
